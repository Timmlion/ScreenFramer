import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import clsx from 'clsx';
import { EditorConfig } from '../../utils/types';
import { getContainerDimensions } from '../../utils/layoutLogic';
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

  const dimensions = image && imageDimensions 
    ? getContainerDimensions(imageDimensions.width, imageDimensions.height, config)
    : { width: 600, height: 400, style: { aspectRatio: config.aspectRatio === 'auto' ? undefined : config.aspectRatio.replace(':', '/') } };

  const aspectRatioStyle = !image && 'style' in dimensions ? dimensions.style.aspectRatio : undefined;

  // Calculate scaled dimensions for the wrapper
  // dimensions.width/height are numbers coming from getContainerDimensions or the fallback object (we need to cast or access properly)
  const actualWidth = 'width' in dimensions ? dimensions.width : 600;
  const actualHeight = 'height' in dimensions ? dimensions.height : 400;

  const scaledWidth = actualWidth * zoom;
  const scaledHeight = actualHeight * zoom;

  return (
    <div
      className="flex-1 flex items-center justify-center bg-background p-8 overflow-auto min-h-0"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div 
        style={{ width: scaledWidth, height: scaledHeight }} 
        className="flex-shrink-0 transition-all duration-300"
      >
        <div
          ref={canvasRef}
          className={clsx(
            'relative flex items-center justify-center shadow-2xl overflow-hidden',
            !image && 'w-[600px] h-[400px]'
          )}
          style={{
            background: config.background,
            padding: `${config.padding}px`,
            width: image ? `${dimensions.width}px` : undefined,
            height: image ? `${dimensions.height}px` : undefined,
            aspectRatio: aspectRatioStyle,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            borderRadius: `${config.backgroundRadius}px`,
          }}
        >
          {image ? (
            <WindowFrame
              style={config.windowStyle}
              radius={config.radius}
              shadow={config.shadow}
              imageDimensions={imageDimensions}
            >
              <img
                src={image}
                alt="Screenshot"
                className="block"
              />
            </WindowFrame>
          ) : (
            <div className="flex flex-col items-center text-text-main p-8 border-2 border-dashed border-border rounded-xl bg-surface/50 backdrop-blur-sm">
              <Upload size={48} className="mb-4 text-text-muted opacity-50" />
              <p className="text-lg font-medium mb-2">Drop your screenshot here</p>
              <p className="text-sm text-text-muted opacity-60 mb-4">or paste from clipboard (Ctrl+V)</p>
              <label className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onImageUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
