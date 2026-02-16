import { Principal } from '@icp-sdk/core/principal';

export interface Point {
  x: number;
  y: number;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type ElementType = 'stroke' | 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'text' | 'sticky';

export interface BaseElement {
  id: string;
  type: ElementType;
  author?: Principal;
  timestamp: number;
}

export interface StrokeElement extends BaseElement {
  type: 'stroke';
  points: Point[];
  color: Color;
  size: number;
}

export interface ShapeElement extends BaseElement {
  type: 'rectangle' | 'ellipse' | 'line' | 'arrow';
  start: Point;
  end: Point;
  color: Color;
  size: number;
}

export interface TextElement extends BaseElement {
  type: 'text' | 'sticky';
  position: Point;
  text: string;
  color: Color;
  fontSize: number;
  width?: number;
  height?: number;
}

export type WhiteboardElement = StrokeElement | ShapeElement | TextElement;

export interface SelectionHandle {
  x: number;
  y: number;
  type: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';
}
