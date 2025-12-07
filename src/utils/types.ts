export type WindowStyle = 'mac-dark' | 'mac-light' | 'win' | 'none';
export type AspectRatio = 'auto' | '16/9' | '9/16' | '4/3' | '3/4' | '1/1' | '4/5';

export interface EditorConfig {
  background: string;
  padding: number;
  radius: number;
  shadow: number; // 0-100 (opacity/spread factor)
  windowStyle: WindowStyle;
  aspectRatio: AspectRatio;
  scale: number; // 1, 2
}

export const DEFAULT_CONFIG: EditorConfig = {
  background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
  padding: 64,
  radius: 16,
  shadow: 50,
  windowStyle: 'mac-dark',
  aspectRatio: 'auto',
  scale: 2,
};
