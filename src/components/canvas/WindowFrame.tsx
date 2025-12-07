import React from 'react';
import clsx from 'clsx';
import { WindowStyle } from '../../utils/types';

interface WindowFrameProps {
  style: WindowStyle;
  radius: number;
  shadow: number;
  imageDimensions: { width: number; height: number } | null;
  children: React.ReactNode;
  className?: string;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  style,
  radius,
  shadow,
  imageDimensions, // Destructure imageDimensions
  children,
  className,
}) => {
  const shadowStyle = {
    boxShadow: `0 ${shadow * 0.5}px ${shadow * 1.5}px rgba(0,0,0, ${shadow * 0.005 + 0.1})`,
  };

  const borderRadius = { borderRadius: `${radius}px` };

  // Calculate intrinsic aspect ratio of the window frame
  let intrinsicAspectRatioStyle = {};
  if (imageDimensions && style !== 'none') {
    // Top bar height in pixels, assuming default font size leading to 2rem = 32px
    const topBarHeightPx = 32;
    // The image itself will have padding inside the content area from p-2.
    // The content area is flex-grow, so we assume the image fills it.
    // This is a simplification; for precision, image's actual rendered size is needed.
    // A better approach would be to measure the rendered image size.
    const effectiveImageHeight = imageDimensions.height;
    const effectiveImageWidth = imageDimensions.width;

    // Aspect ratio of the content area (image + padding)
    const contentAspectRatio = effectiveImageWidth / effectiveImageHeight;

    // To prevent the top bar from flattening, we need to calculate the aspect ratio of the
    // entire WindowFrame, considering the fixed top bar height.
    // This is still a heuristic, as the final pixel height will depend on the overall scaling.
    // For now, we assume the content area will fill available width when scaled.
    // Let's set the aspect ratio of the *outer container* to be of the image, then top bar is on top.
    // This calculation is hard with flex-grow and fixed-height items without knowing final pixel dimensions.
    // Instead of forcing aspect ratio on the entire window, let the image content area guide it.
    // The goal is for the TOP BAR to not flatten. This means the overall WindowFrame should scale proportionally.
    // We can define a default 'ideal' width for the window frame, say 800px.
    // Then calculate the total height if image is 800px wide.
    const idealWindowWidth = 800; // arbitrary ideal width
    const imageDisplayHeightAtIdealWidth = idealWindowWidth / contentAspectRatio;
    const totalIdealHeight = imageDisplayHeightAtIdealWidth + topBarHeightPx;
    intrinsicAspectRatioStyle = { aspectRatio: `${idealWindowWidth}/${totalIdealHeight}` };

  } else if (imageDimensions && style === 'none') {
    intrinsicAspectRatioStyle = { aspectRatio: `${imageDimensions.width}/${imageDimensions.height}` };
  }


  if (style === 'none') {
    return (
      <div
        className={clsx('overflow-hidden', className)}
        style={{ ...shadowStyle, ...borderRadius, ...intrinsicAspectRatioStyle }}
      >
        {children}
      </div>
    );
  }

  const isDark = style === 'mac-dark';
  const bgClass = isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  const borderClass = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div
      className={clsx(
        'flex flex-col overflow-hidden transition-all duration-200',
        bgClass,
        className
      )}
      style={{ ...shadowStyle, ...borderRadius, ...intrinsicAspectRatioStyle }} // Apply intrinsic aspect ratio
    >
      <div
        className={clsx(
          'h-8 flex flex-shrink-0 items-center px-4 space-x-2 border-b select-none',
          borderClass,
          style === 'mac-dark' ? 'border-gray-700/50' : 'border-gray-200/50'
        )}
      >
        {style.startsWith('mac') && (
          <>
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </>
        )}
        {style === 'win' && (
           <div className="flex w-full justify-end space-x-2 opacity-50 text-gray-700">
             <div className="w-3 h-3 border border-current rounded-sm" />
             <div className="w-3 h-3 border border-current rounded-sm relative"><div className="absolute inset-0 m-auto w-2 h-[1px] bg-current"></div></div>
             <div className="w-3 h-3 relative"><div className="absolute inset-0 m-auto w-3 h-[1px] bg-current rotate-45"></div><div className="absolute inset-0 m-auto w-3 h-[1px] bg-current -rotate-45"></div></div>
           </div>
        )}
      </div>

      {/* Content */}
      <div className="relative flex-grow flex items-center justify-center p-2 bg-black/5">
        {children}
      </div>
    </div>
  );
};
