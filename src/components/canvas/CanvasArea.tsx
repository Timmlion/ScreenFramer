import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    accept: {
      'image/*': [],
    },
    noClick: !!image,
  });

  const dimensions = image && imageDimensions 
    ? getContainerDimensions(imageDimensions.width, imageDimensions.height, config)
    : { width: 600, height: 400, style: { aspectRatio: config.aspectRatio === 'auto' ? undefined : config.aspectRatio.replace(':', '/') } };

  console.log('CanvasArea Debug:', {
    configAspectRatio: config.aspectRatio,
    imageDimensions,
    calculatedDimensions: dimensions
  });

  return (
    <div
      className="flex-1 flex items-center justify-center bg-gray-900/50 p-8 overflow-auto min-h-0"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
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
  );
};
