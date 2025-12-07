import React from 'react';
import clsx from 'clsx';
import { WindowStyle } from '../../utils/types';

interface WindowFrameProps {
  style: WindowStyle;
  radius: number;
  shadow: number;
  children: React.ReactNode;
  className?: string;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  style,
  radius,
  shadow,
  children,
  className,
}) => {
  const shadowStyle = {
    boxShadow: `0 ${shadow * 0.5}px ${shadow * 1.5}px rgba(0,0,0, ${shadow * 0.005 + 0.1})`,
  };

  const borderRadius = { borderRadius: `${radius}px` };

  if (style === 'none') {
    return (
      <div
        className={clsx('overflow-hidden', className)}
        style={{ ...shadowStyle, ...borderRadius }}
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
      style={{ ...shadowStyle, ...borderRadius }}
    >
      {/* Title Bar */}
      <div
        className={clsx(
          'h-8 flex items-center px-4 space-x-2 border-b select-none',
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
           <div className="flex w-full justify-end space-x-2 opacity-50">
             <div className="w-3 h-3 border border-current rounded-sm" />
             <div className="w-3 h-3 border border-current rounded-sm relative"><div className="absolute inset-0 m-auto w-2 h-[1px] bg-current"></div></div>
             <div className="w-3 h-3 relative"><div className="absolute inset-0 m-auto w-3 h-[1px] bg-current rotate-45"></div><div className="absolute inset-0 m-auto w-3 h-[1px] bg-current -rotate-45"></div></div>
           </div>
        )}
      </div>

      {/* Content */}
      <div className="relative w-full h-full bg-black/5">
        {children}
      </div>
    </div>
  );
};
