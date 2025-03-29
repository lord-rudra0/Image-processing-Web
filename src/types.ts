export interface ImageFilter {
  name: string;
  type: 'range' | 'toggle';
  min?: number;
  max?: number;
  default: number;
  unit?: string;
  cssProperty?: string;
}

export interface FilterValues {
  [key: string]: number;
}