import { useState, useRef, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import clsx from 'clsx';
import { Coffee, CheckCircle } from 'lucide-react';
import { EditorConfig, DEFAULT_CONFIG } from './utils/types';
import { calculateInitialConfigFromImage, getContainerDimensions, calculateFitZoom } from './utils/layoutLogic';
import { CanvasArea } from './components/canvas/CanvasArea';
import { Sidebar } from './components/controls/Sidebar';
import { Header } from './components/layout/Header';

// Custom CSS for simple fade-in/zoom-in effect
const modalEnterClasses = "transition-all duration-300 ease-out opacity-100 scale-100";
const modalInitialClasses = "opacity-0 scale-95";

function App() {
  const [config, setConfig] = useState<EditorConfig>(DEFAULT_CONFIG);
  const [image, setImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false); // State for the checkbox
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleConfigChange = (updates: Partial<EditorConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateFitZoom = useCallback(() => {
    if (!imageDimensions) {
      setZoom(1); // Default zoom if no image
      return;
    }

    const containerDims = getContainerDimensions(
      imageDimensions.width,
      imageDimensions.height,
      config
    );
    const newZoom = calculateFitZoom(containerDims.width, containerDims.height);
    setZoom(newZoom);
  }, [imageDimensions, config]); // Recalculate if image or config changes

  // Recalculate zoom when relevant config or image dimensions change
  useEffect(() => {
    updateFitZoom();
    // Also recalculate on window resize
    window.addEventListener('resize', updateFitZoom);
    return () => window.removeEventListener('resize', updateFitZoom);
  }, [updateFitZoom]);


  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
          setImage(e.target?.result as string);
          setImageDimensions(dimensions);

          // 1. Determine new config (Mode, Aspect Ratio)
          const newConfigUpdates = calculateInitialConfigFromImage(
            dimensions.width,
            dimensions.height,
            config
          );
          
          const mergedConfig = { ...config, ...newConfigUpdates };
          
          setConfig(mergedConfig);
          // Zoom will be updated by useEffect after config state update
        };
        img.src = e.target?.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const closeCoffeeModal = () => {
    if (dontShowAgain) {
      localStorage.setItem('dontShowCoffeeModalAgain', 'true');
    }
    setShowCoffeeModal(false);
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);

    // Small delay to ensure UI is ready/clean if needed
    await new Promise(r => setTimeout(r, 100));

    try {
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: config.scale,
        backgroundColor: 'transparent', // Set background to transparent
        style: { transform: 'none' }, // Reset zoom for export to capture full size without scaling
      });
      const link = document.createElement('a');
      link.download = `screenframer-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      // After download, show the coffee modal, unless 'dontShowAgain' is set
      const userPreference = localStorage.getItem('dontShowCoffeeModalAgain');
      if (userPreference !== 'true') {
        setShowCoffeeModal(true);
      }

    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Global Paste Handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleImageUpload(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background font-sans text-text-main">
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        <CanvasArea
          config={config}
          image={image}
          imageDimensions={imageDimensions} // Pass image dimensions
          onImageUpload={handleImageUpload}
          canvasRef={canvasRef}
          zoom={zoom}
        />
        <Sidebar
          config={config}
          onChange={handleConfigChange}
          onDownload={handleDownload}
          isDownloading={isDownloading}
          zoom={zoom}
          onZoomChange={handleZoomChange}
        />
      </div>

      {/* Success/Coffee Modal */}
      {showCoffeeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className={clsx(
            "bg-surface border border-border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden",
            showCoffeeModal ? modalEnterClasses : modalInitialClasses
          )}>
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={24} />
              </div>
              
              <h2 className="text-lg font-bold text-text-main mb-2">File Ready!</h2>
              <p className="text-text-muted text-sm mb-6 leading-relaxed">
                This tool was created in my free time. If it helped you, consider buying me a virtual coffee.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => window.open('https://ko-fi.com/adamsiwek', '_blank')}
                  className="w-full bg-brand hover:bg-brand-hover text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Coffee size={16} /> Buy me a Coffee
                </button>
                <button
                  onClick={closeCoffeeModal}
                  className="w-full bg-transparent text-text-muted hover:text-text-main hover:bg-white/5 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Maybe later
                </button>
              </div>

              {/* Checkbox */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted hover:text-text-main transition-colors">
                <input
                  type="checkbox"
                  id="dont-show"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded bg-surface border-border text-brand focus:ring-brand cursor-pointer"
                />
                <label htmlFor="dont-show" className="cursor-pointer select-none">Don't show this again</label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;