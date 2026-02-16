import { Point, Viewport } from './types';

export function screenToWorld(screenX: number, screenY: number, viewport: Viewport): Point {
  return {
    x: (screenX - viewport.x) / viewport.zoom,
    y: (screenY - viewport.y) / viewport.zoom,
  };
}

export function worldToScreen(worldX: number, worldY: number, viewport: Viewport): Point {
  return {
    x: worldX * viewport.zoom + viewport.x,
    y: worldY * viewport.zoom + viewport.y,
  };
}

export function clampZoom(zoom: number): number {
  return Math.max(0.1, Math.min(5, zoom));
}
