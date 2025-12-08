import { useState, useRef, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import clsx from 'clsx';
import { EditorConfig, DEFAULT_CONFIG } from './utils/types';
import { calculateInitialConfigFromImage, getContainerDimensions, calculateFitZoom } from './utils/layoutLogic';
import { CanvasArea } from './components/canvas/CanvasArea';
import { Sidebar } from './components/controls/Sidebar';

// Custom CSS for simple fade-in/zoom-in effect
// For more complex animations, a dedicated CSS file or utility can be created
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
    const newZoom = calculateFitZoom(containerDims.width, containerDims.height, config);
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
        backgroundColor: null, // Set background to null for transparency
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
    <div className="flex h-screen w-screen overflow-hidden bg-black font-sans text-white">
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

      {/* Coffee Modal */}
      {showCoffeeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className={clsx(
            "bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl w-full max-w-md overflow-hidden",
            showCoffeeModal ? modalEnterClasses : modalInitialClasses
          )}>
            {/* Banner */}
            <div className="h-32 bg-gradient-to-br from-[#FF6B00] to-[#FF9E00] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
              <span className="text-6xl drop-shadow-lg transform hover:scale-110 transition-transform duration-300 cursor-default">☕</span>
            </div>
            {/* Content */}
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Enjoying LivePreview?</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                If this tool saved you some time, please consider buying me a coffee to support future updates!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => window.open('https://ko-fi.com/adamsiwek', '_blank')}
                  className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <span>☕</span> Buy me a coffee
                </button>
                <button
                  onClick={closeCoffeeModal}
                  className="w-full bg-transparent border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800/50 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Maybe later
                </button>
              </div>

              {/* Checkbox */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-400 transition-colors">
                <input
                  type="checkbox"
                  id="dont-show"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded bg-gray-800 border-gray-600 text-[#FF6B00] focus:ring-[#FF6B00] cursor-pointer"
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