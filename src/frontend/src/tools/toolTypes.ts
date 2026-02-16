import { Color } from '@/canvas/types';

export type ToolType =
  | 'select'
  | 'pen'
  | 'eraser'
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'arrow'
  | 'text'
  | 'sticky';

export interface ToolSettings {
  strokeSize: number;
  strokeColor: Color;
  fillColor: Color;
}
