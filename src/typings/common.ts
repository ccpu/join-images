import type { Buffer } from 'node:buffer';
import type { Color, Sharp } from 'sharp';

type InputSource = string | Buffer | Sharp;

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

export interface ImageSource {
  offsetX?: number;
  offsetY?: number;
  src: InputSource;
}

export type JoinImageInput = InputSource | ImageSource;
