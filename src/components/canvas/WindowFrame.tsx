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

  const isDark = style === 'mac-dark' || style === 'mobile-dark';
  const isMobile = style.startsWith('mobile');

  // Calculate intrinsic aspect ratio of the window frame
  let intrinsicAspectRatioStyle = {};
  if (imageDimensions && style === 'none') {
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
          'flex flex-shrink-0 items-center border-b select-none',
          isMobile ? 'h-16 px-8' : 'h-8 px-4',
          borderClass,
          style === 'mac-dark' || style === 'mobile-dark' ? 'border-gray-700/50' : 'border-gray-200/50'
        )}
      >
        {isMobile ? (
          // Mobile status bar
          <div className="flex w-full items-center justify-between text-lg font-semibold tracking-wide opacity-90">
            <span>9:41</span>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-5 h-5 bg-current rounded-full opacity-20" />
                <div className="w-5 h-5 bg-current rounded-full opacity-20" />
                <div className="w-5 h-5 bg-current rounded-full opacity-20" />
                <div className="w-5 h-5 bg-current rounded-full opacity-20" />
              </div>
              {/* Battery Icon */}
              <div className="w-8 h-4 border-2 border-current rounded-sm relative ml-2">
                <div className="absolute inset-0.5 bg-current rounded-[1px]" />
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-2 bg-current rounded-r-sm" />
              </div>
            </div>
          </div>
        ) : style.startsWith('mac') ? (
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F]" />
          </div>
        ) : style === 'win' ? (
          <div className="flex w-full justify-end space-x-2 opacity-50 text-gray-700">
            <div className="w-3 h-3 border border-current rounded-sm" />
            <div className="w-3 h-3 border border-current rounded-sm relative"><div className="absolute inset-0 m-auto w-2 h-[1px] bg-current"></div></div>
            <div className="w-3 h-3 relative"><div className="absolute inset-0 m-auto w-3 h-[1px] bg-current rotate-45"></div><div className="absolute inset-0 m-auto w-3 h-[1px] bg-current -rotate-45"></div></div>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="relative flex-grow flex items-center justify-center p-2 bg-black/5">
        {children}
      </div>
    </div>
  );
};
