import { Color } from 'sharp';
export interface Options {
  direction?: 'vertical' | 'horizontal';
  color?: Color;
  align?: 'start' | 'center' | 'end' | 'start';
  offset?: number;
  margin?:
    | number
    | string
    | { top?: number; left?: number; right?: number; bottom?: number };
}
