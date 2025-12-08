export interface ImageDimensions {
  width: number;
  height: number;
}

export type ImageOrientation = 'portrait' | 'landscape' | 'square';

export const getImageOrientation = (dimensions: ImageDimensions | null): ImageOrientation => {
  if (!dimensions) return 'landscape';

  const { width, height } = dimensions;
  const aspectRatio = width / height;

  // Consider images with aspect ratio < 0.85 as portrait
  // Consider images with aspect ratio > 1.15 as landscape
  // Everything in between is considered square
  if (aspectRatio < 0.85) return 'portrait';
  if (aspectRatio > 1.15) return 'landscape';
  return 'square';
};

export const isPortraitImage = (dimensions: ImageDimensions | null): boolean => {
  return getImageOrientation(dimensions) === 'portrait';
};