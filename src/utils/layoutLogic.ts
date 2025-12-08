import { EditorConfig, WindowStyle, EditorMode, AspectRatio } from './types';

export const calculateInitialConfigFromImage = (
  width: number,
  height: number,
  currentConfig: EditorConfig
): Partial<EditorConfig> => {
  const ratio = width / height;
  let newMode: EditorMode = 'other';
  let newStyle = currentConfig.windowStyle;
  let newAspectRatio: AspectRatio = currentConfig.aspectRatio;
  
  const isDarkMode = currentConfig.windowStyle.includes('dark') || currentConfig.windowStyle === 'none';

  if (ratio < 0.85) {
    // Portrait -> Mobile
    newMode = 'mobile';
    newStyle = isDarkMode ? 'mobile-dark' : 'mobile-light';
    newAspectRatio = '9/16';
  } else if (ratio > 1.15) {
    // Landscape -> Desktop
    newMode = 'desktop';
    
    // Switch style if it was mobile
    if (newStyle.includes('mobile')) {
      newStyle = isDarkMode ? 'mac-dark' : 'mac-light';
    }
    
    newAspectRatio = '16/9';
  } else {
    // Square-ish -> Other
    newMode = 'other';
    if (newStyle.includes('mobile')) {
      newStyle = 'none';
    }
    newAspectRatio = '1/1';
  }

  return {
    mode: newMode,
    windowStyle: newStyle,
    aspectRatio: newAspectRatio
  };
};

export const getContainerDimensions = (
  imageWidth: number,
  imageHeight: number,
  config: EditorConfig
): { width: number; height: number } => {
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

  const contentWidth = imageWidth + horizontalOverhead;
  const contentHeight = imageHeight + verticalOverhead;

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
    // Width is the constraint. Increase height.
    finalWidth = minWidth;
    finalHeight = minWidth / targetRatio;
  } else {
    // Content is taller (or narrower) than target ratio allows.
    // Height is the constraint. Increase width.
    finalHeight = minHeight;
    finalWidth = minHeight * targetRatio;
  }

  return { width: finalWidth, height: finalHeight };
};

export const calculateFitZoom = (
  containerWidth: number,
  containerHeight: number,
  currentConfig: EditorConfig // We need currentConfig for padding, etc.
): number => {
  const sidebarWidth = 320;
  const padding = 80; // Approximate padding around canvas

  // These should perhaps be dynamic based on the actual parent element size
  // but for now, we use window.innerWidth/Height assuming the main canvas area is `flex-1`
  // and sidebar is fixed 320px.
  const availableWidth = window.innerWidth - sidebarWidth - padding;
  const availableHeight = window.innerHeight - padding;

  const fitZoom = Math.min(
    availableWidth / containerWidth,
    availableHeight / containerHeight,
    1 // Don't zoom in by default if it's small
  );

  return Math.max(0.1, Math.floor(fitZoom * 100) / 100);
};

