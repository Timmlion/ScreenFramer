import React, { useCallback } from 'react';
import clsx from 'clsx';
import { Upload } from 'lucide-react';
import { EditorConfig } from '../../utils/types';
import { WindowFrame } from './WindowFrame';

interface CanvasAreaProps {
  config: EditorConfig;
  image: string | null;
  imageDimensions: { width: number; height: number } | null; // Added imageDimensions
  onImageUpload: (file: File) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  config,
  image,
  imageDimensions, // Destructure imageDimensions
  onImageUpload,
  canvasRef,
  zoom,
}) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const getContainerDimensions = () => {
    if (!image || !imageDimensions) {
      return {
        width: 600,
        height: 400,
        style: { aspectRatio: config.aspectRatio === 'auto' ? undefined : config.aspectRatio.replace(':', '/') }
      };
    }

    // 1. Calculate Content Size (Image + Frame Overhead)
    const isMobile = config.windowStyle.startsWith('mobile');
    const isNone = config.windowStyle === 'none';

    // Overhead calculations
    // Horizontal: padding (16) + borders (2) -> approx 20px. If none, 0.
    const horizontalOverhead = isNone ? 0 : 20;

    // Vertical: Header (64 mobile, 32 desktop) + padding (16) + borders (2). If none, 0.
    let verticalOverhead = 0;
    if (!isNone) {
      verticalOverhead = (isMobile ? 64 : 32) + 16 + 2;
    }

    const contentWidth = imageDimensions.width + horizontalOverhead;
    const contentHeight = imageDimensions.height + verticalOverhead;

    // 2. Add User Padding
    const minWidth = contentWidth + (config.padding * 2);
    const minHeight = contentHeight + (config.padding * 2);

    // 3. Apply Aspect Ratio
    if (config.aspectRatio === 'auto') {
      return { width: minWidth, height: minHeight };
    }

    // Parse ratio
    const [w, h] = config.aspectRatio.replace(':', '/').split('/').map(Number);
    const targetRatio = w / h;
    const currentRatio = minWidth / minHeight;

    let finalWidth = minWidth;
    let finalHeight = minHeight;

    if (currentRatio > targetRatio) {
      // Content is wider than target ratio allows.
      // Width is the constraint. Increase height to match ratio.
      finalWidth = minWidth;
      finalHeight = minWidth / targetRatio;
    } else {
      // Content is taller than target ratio allows.
      // Height is the constraint. Increase width to match ratio.
      finalHeight = minHeight;
      finalWidth = minHeight * targetRatio;
    }

    return { width: finalWidth, height: finalHeight };
  };

  const dimensions = getContainerDimensions();

  return (
    <div
      className="flex-1 flex items-center justify-center bg-gray-900/50 p-8 overflow-auto min-h-0"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div
        ref={canvasRef}
        className={clsx(
          'relative flex items-center justify-center transition-all duration-300 shadow-2xl overflow-hidden',
          // If no image, we still want to show the background/canvas so user knows where to drop,
          // but maybe with a min size.
          !image && 'w-[600px] h-[400px]'
        )}
        style={{
          background: config.background,
          padding: `${config.padding}px`,
          width: image ? `${dimensions.width}px` : undefined,
          height: image ? `${dimensions.height}px` : undefined,
          aspectRatio: !image && dimensions.style?.aspectRatio ? dimensions.style.aspectRatio : undefined,
          transform: `scale(${zoom})`,
          transformOrigin: 'center',
        }}
      >
        {image ? (
          <WindowFrame
            style={config.windowStyle}
            radius={config.radius}
            shadow={config.shadow}
            imageDimensions={imageDimensions}
          // Removed max-w-full max-h-full to allow frame to dictate size
          >
            <img
              src={image}
              alt="Screenshot"
              className="block" // Removed w-full h-full object-contain to allow natural size
            />
          </WindowFrame>
        ) : (
          <div className="flex flex-col items-center text-white/80 p-8 border-2 border-dashed border-white/30 rounded-xl bg-black/20 backdrop-blur-sm">
            <Upload size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Drop your screenshot here</p>
            <p className="text-sm opacity-60 mb-4">or paste from clipboard (Ctrl+V)</p>
            <label className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors text-sm font-medium">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
