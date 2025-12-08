import { describe, it, expect } from 'vitest';
import { calculateInitialConfigFromImage, getContainerDimensions } from './layoutLogic';
import { EditorConfig } from './types';

// Mock minimal config
const mockConfig: EditorConfig = {
    background: '#000',
    padding: 0, // easier math
    radius: 0,
    shadow: 0,
    windowStyle: 'mac-dark',
    aspectRatio: 'auto',
    scale: 1,
    mode: 'desktop'
};

describe('calculateInitialConfigFromImage', () => {
  it('should switch to desktop mode and 16/9 for landscape images', () => {
    // 1920x1080 -> Ratio ~1.77
    const result = calculateInitialConfigFromImage(1920, 1080, mockConfig);
    
    expect(result.mode).toBe('desktop');
    expect(result.aspectRatio).toBe('16/9');
    // Should keep mac-dark if it was compatible
    expect(result.windowStyle).toBe('mac-dark');
  });

  it('should switch to mobile mode and 9/16 for portrait images', () => {
    // 1080x1920 -> Ratio ~0.56
    const result = calculateInitialConfigFromImage(1080, 1920, mockConfig);
    
    expect(result.mode).toBe('mobile');
    expect(result.aspectRatio).toBe('9/16');
    expect(result.windowStyle).toBe('mobile-dark'); // switched from mac-dark
  });

  it('should switch to 1/1 for square images', () => {
    const result = calculateInitialConfigFromImage(1000, 1000, mockConfig);
    
    expect(result.mode).toBe('other');
    expect(result.aspectRatio).toBe('1/1');
  });
});

describe('getContainerDimensions', () => {
    it('should respect 16/9 aspect ratio for desktop screenshot', () => {
        // Image: 1000x500 (2:1 ratio)
        // Target: 16/9 (~1.77)
        // Image is wider than target. Should add letterboxing (height).
        // BUT wait, in our logic:
        // currentRatio (2) > targetRatio (1.77)
        // Width is constraint. Height increases.
        
        const config: EditorConfig = { ...mockConfig, aspectRatio: '16/9', padding: 0, windowStyle: 'none' };
        // With 'none' style, content size is exactly image size (1000x500)
        
        const dims = getContainerDimensions(1000, 500, config);
        
        // Width should stay 1000
        expect(dims.width).toBeCloseTo(1000);
        // Height should be 1000 / (16/9) = 562.5
        expect(dims.height).toBeCloseTo(562.5);
    });

    it('should respect 16/9 aspect ratio for a "tall" desktop screenshot (e.g. browser window)', () => {
        // Image: 800x800 (1:1)
        // Target: 16/9 (~1.77)
        // currentRatio (1) < targetRatio (1.77)
        // Height is constraint. Width increases.
        
        const config: EditorConfig = { ...mockConfig, aspectRatio: '16/9', padding: 0, windowStyle: 'none' };
        
        const dims = getContainerDimensions(800, 800, config);
        
        // Height should stay 800
        expect(dims.height).toBeCloseTo(800);
        // Width should be 800 * (16/9) = 1422.22
        expect(dims.width).toBeCloseTo(1422.22);
    });

    it('should calculate correct dimensions including frame overhead', () => {
        // Image: 100x100
        // Style: mac-dark (overhead: H~20, V~32+16+2=50) -> Content: 120x150
        // Padding: 20 -> Min: 160x190
        // Target: 1/1
        
        const config: EditorConfig = { 
            ...mockConfig, 
            windowStyle: 'mac-dark', 
            padding: 20,
            aspectRatio: '1/1'
        };

        const dims = getContainerDimensions(100, 100, config);
        
        // Min size: 160x190. Ratio ~0.84
        // Target: 1.0
        // Current (0.84) < Target (1.0).
        // Height constraint. Width increases.
        
        // Height stays 190.
        expect(dims.height).toBeCloseTo(190);
        // Width becomes 190 * 1 = 190.
        expect(dims.width).toBeCloseTo(190);
    });
});
