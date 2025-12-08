import React from 'react';
import { Download, Monitor, Layout, Maximize, Droplet, ZoomIn } from 'lucide-react';
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
    <div className="w-80 bg-surface border-l border-border flex flex-col h-full overflow-y-auto text-text-main shrink-0">
      <div className="p-6 space-y-8">
        
        {/* Background */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
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
              className="w-full h-8 rounded cursor-pointer bg-transparent border border-border"
            />
          </div>
        </div>

        {/* Mode */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
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
                    ? 'bg-white/10 border-border text-white'
                    : 'bg-transparent border-border hover:bg-white/5 text-text-muted'
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Window Style */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
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
                      ? 'bg-white/10 border-border text-white'
                      : 'bg-transparent border-border hover:bg-white/5 text-text-muted'
                  )}
                >
                  {style.replace('-', ' ')}
                  {(style === 'mobile-dark' || style === 'mobile-light') && (
                    <span className="ml-1 text-xs text-brand">(mobile)</span>
                  )}
                </button>
              ));
            })()}
          </div>
        </div>

        {/* Adjustments */}
        <div className="space-y-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Maximize size={14} /> Adjustments
          </label>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1"><ZoomIn size={12} /> Zoom</span>
                <span className="text-text-muted">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={zoom * 100}
                onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
                className="w-full accent-brand h-1 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Padding</span>
                <span className="text-text-muted">{config.padding}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={config.padding}
                onChange={(e) => onChange({ padding: Number(e.target.value) })}
                className="w-full accent-brand h-1 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Radius</span>
                <span className="text-text-muted">{config.radius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={config.radius}
                onChange={(e) => onChange({ radius: Number(e.target.value) })}
                className="w-full accent-brand h-1 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Shadow</span>
                <span className="text-text-muted">{config.shadow}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.shadow}
                onChange={(e) => onChange({ shadow: Number(e.target.value) })}
                className="w-full accent-brand h-1 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Background Radius */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Background Radius</span>
                <span className="text-text-muted">{config.backgroundRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.backgroundRadius}
                onChange={(e) => onChange({ backgroundRadius: Number(e.target.value) })}
                className="w-full accent-brand h-1 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Layout size={14} /> Aspect Ratio
          </label>
          <div className="relative">
            <select
              value={config.aspectRatio}
              onChange={(e) => onChange({ aspectRatio: e.target.value as AspectRatio })}
              className="w-full appearance-none bg-background border border-border text-text-main text-sm rounded-lg focus:ring-brand focus:border-brand block p-2.5 hover:bg-white/5 transition-colors cursor-pointer outline-none"
            >
              <option value="auto">Auto</option>
              <option value="16/9">16:9 (Twitter/Youtube)</option>
              <option value="9/16">9:16 (Stories/Reels)</option>
              <option value="4/3">4:3 (Standard)</option>
              <option value="3/4">3:4 (Portrait)</option>
              <option value="1/1">1:1 (Square)</option>
              <option value="4/5">4:5 (Instagram Portrait)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-border space-y-4">
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full py-3 bg-brand text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/20"
        >
          {isDownloading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download size={20} />
          )}
          Download PNG
        </button>
      </div>
    </div>
  );
};