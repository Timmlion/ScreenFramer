import React from 'react';
import { Coffee, Github } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 shrink-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-text-main">
          ScreenFramer<span className="text-brand">.</span>
        </span>
      </div>

      {/* Right: Socials & Action */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-r border-border pr-4">
          <a
            href="https://github.com/adamsiwek"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-brand transition-colors"
            title="GitHub"
          >
            <Github size={18} />
          </a>
        </div>
        
        <a
          href="https://ko-fi.com/adamsiwek"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-brand transition-colors group"
        >
          <Coffee size={18} className="group-hover:text-brand transition-colors" />
          <span className="hidden sm:inline">Support</span>
        </a>
      </div>
    </header>
  );
};
