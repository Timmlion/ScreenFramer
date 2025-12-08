import React from 'react';
import { Download, Monitor, Layout, Maximize, Droplet, Coffee, ZoomIn } from 'lucide-react';
import { EditorConfig, WindowStyle, AspectRatio, EditorMode } from '../../utils/types';
import { gradients } from '../../utils/gradients';
import clsx from 'clsx';

interface SidebarProps {
  config: EditorConfig;
  onChange: (updates: Partial<EditorConfig>) => void;
  onDownload: () => void;
  isDownloading: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  onChange,
  onDownload,
  isDownloading,
  zoom,
  onZoomChange,
}) => {
  return (
    <div className="w-80 bg-gray-950 border-l border-gray-800 flex flex-col h-screen overflow-y-auto text-gray-300">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-white mb-1">ScreenFramer</h1>
          <p className="text-xs text-gray-500">Beautify your screenshots instantly.</p>
        </div>

        {/* Background */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Droplet size={14} /> Background
          </label>
          <div className="grid grid-cols-4 gap-2">
            {gradients.map((g) => (
              <button
                key={g.name}
                className={clsx(
                  'w-full aspect-square rounded-full border-2 transition-all',
                  config.background === g.value
                    ? 'border-white scale-110'
                    : 'border-transparent hover:scale-105'
                )}
                style={{ background: g.value }}
                onClick={() => onChange({ background: g.value })}
                title={g.name}
              />
            ))}
          </div>
          {/* Simple Custom Color Input fallback for now */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              value={config.background.startsWith('#') && !config.background.includes('gradient') ? config.background : '#000000'}
              onChange={(e) => onChange({ background: e.target.value })}
              className="w-full h-8 rounded cursor-pointer bg-transparent border border-gray-700"
            />
          </div>
        </div>

        {/* Mode */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Layout size={14} /> Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['desktop', 'mobile', 'other'] as EditorMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  let newStyle = config.windowStyle;
                  const isDark = config.windowStyle.includes('dark') || config.windowStyle === 'none';
                  let newAspectRatio = config.aspectRatio;

                  if (mode === 'mobile') {
                    newStyle = isDark ? 'mobile-dark' : 'mobile-light';
                    newAspectRatio = '9/16';
                  } else if (mode === 'desktop') {
                    newStyle = isDark ? 'mac-dark' : 'mac-light';
                    newAspectRatio = '16/9';
                  } else {
                    newStyle = 'none';
                    newAspectRatio = '1/1';
                  }
                  onChange({ mode, windowStyle: newStyle, aspectRatio: newAspectRatio });
                }}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium border transition-all capitalize',
                  config.mode === mode
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-transparent border-gray-800 hover:bg-gray-900 text-gray-400'
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Window Style */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Monitor size={14} /> Window Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(() => {
              let styles: WindowStyle[] = [];

              if (config.mode === 'mobile') {
                styles = ['mobile-dark', 'mobile-light'];
              } else if (config.mode === 'desktop') {
                styles = ['mac-dark', 'mac-light', 'win'];
              } else {
                styles = ['none', 'mac-dark', 'win'];
              }

              return styles.map((style) => (
                <button
                  key={style}
                  onClick={() => onChange({ windowStyle: style })}
                  className={clsx(
                    'px-3 py-2 rounded-lg text-sm font-medium border transition-all capitalize',
                    config.windowStyle === style
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-transparent border-gray-800 hover:bg-gray-900 text-gray-400'
                  )}
                >
                  {style.replace('-', ' ')}
                  {(style === 'mobile-dark' || style === 'mobile-light') && (
                    <span className="ml-1 text-xs text-blue-400">(mobile)</span>
                  )}
                </button>
              ));
            })()}
          </div>
        </div>

        {/* Adjustments */}
        <div className="space-y-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Maximize size={14} /> Adjustments
          </label>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1"><ZoomIn size={12} /> Zoom</span>
                <span className="text-gray-500">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={zoom * 100}
                onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
                className="w-full accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Padding</span>
                <span className="text-gray-500">{config.padding}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={config.padding}
                onChange={(e) => onChange({ padding: Number(e.target.value) })}
                className="w-full accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Radius</span>
                <span className="text-gray-500">{config.radius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={config.radius}
                onChange={(e) => onChange({ radius: Number(e.target.value) })}
                className="w-full accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Shadow</span>
                <span className="text-gray-500">{config.shadow}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.shadow}
                onChange={(e) => onChange({ shadow: Number(e.target.value) })}
                className="w-full accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Layout size={14} /> Aspect Ratio
          </label>
          <div className="relative">
            <select
              value={config.aspectRatio}
              onChange={(e) => onChange({ aspectRatio: e.target.value as AspectRatio })}
              className="w-full appearance-none bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 hover:bg-gray-800 transition-colors cursor-pointer outline-none"
            >
              <option value="auto">Auto</option>
              <option value="16/9">16:9 (Twitter/Youtube)</option>
              <option value="9/16">9:16 (Stories/Reels)</option>
              <option value="4/3">4:3 (Standard)</option>
              <option value="3/4">3:4 (Portrait)</option>
              <option value="1/1">1:1 (Square)</option>
              <option value="4/5">4:5 (Instagram Portrait)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-gray-800 space-y-4">
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <Download size={20} />
          )}
          Download PNG
        </button>

        <a
          href="https://ko-fi.com/adamsiwek" // Hypothetical link based on persona
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-[#FF5E5B] transition-colors"
        >
          <Coffee size={14} />
          <span>Buy me a coffee</span>
        </a>
      </div>
    </div>
  );
};
