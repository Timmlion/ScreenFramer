import React, { useCallback } from 'react';
import clsx from 'clsx';
import { Upload } from 'lucide-react';
import { EditorConfig } from '../../utils/types';
import { WindowFrame } from './WindowFrame';

interface CanvasAreaProps {
  config: EditorConfig;
  image: string | null;
  onImageUpload: (file: File) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  config,
  image,
  onImageUpload,
  canvasRef,
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

  const getAspectRatioStyle = () => {
    if (config.aspectRatio === 'auto') return {};
    return { aspectRatio: config.aspectRatio };
  };

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
          ...getAspectRatioStyle(),
          // If auto, let it grow. If ratio, width 100%? No, we want it to fit in the view.
          // For the preview, we might just let it scale naturally or max-width.
          // But for export, we capture this div.
        }}
      >
        {image ? (
          <WindowFrame
            style={config.windowStyle}
            radius={config.radius}
            shadow={config.shadow}
            className="max-w-full max-h-full object-contain"
          >
            <img
              src={image}
              alt="Screenshot"
              className="block w-full h-auto"
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
