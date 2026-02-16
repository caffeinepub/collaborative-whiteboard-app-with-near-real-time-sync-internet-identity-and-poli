import { WhiteboardElement, Point } from './types';

export function hitTestElement(element: WhiteboardElement, point: Point, threshold = 10): boolean {
  switch (element.type) {
    case 'stroke':
      return hitTestStroke(element, point, threshold);
    case 'rectangle':
    case 'ellipse':
    case 'line':
    case 'arrow':
      return hitTestShape(element, point, threshold);
    case 'text':
    case 'sticky':
      return hitTestText(element, point);
    default:
      return false;
  }
}

function hitTestStroke(element: any, point: Point, threshold: number): boolean {
  for (let i = 0; i < element.points.length - 1; i++) {
    const p1 = element.points[i];
    const p2 = element.points[i + 1];
    const dist = distanceToLineSegment(point, p1, p2);
    if (dist < threshold + element.size / 2) {
      return true;
    }
  }
  return false;
}

function hitTestShape(element: any, point: Point, threshold: number): boolean {
  const minX = Math.min(element.start.x, element.end.x);
  const maxX = Math.max(element.start.x, element.end.x);
  const minY = Math.min(element.start.y, element.end.y);
  const maxY = Math.max(element.start.y, element.end.y);

  return (
    point.x >= minX - threshold &&
    point.x <= maxX + threshold &&
    point.y >= minY - threshold &&
    point.y <= maxY + threshold
  );
}

function hitTestText(element: any, point: Point): boolean {
  const width = element.width || 200;
  const height = element.height || 100;

  return (
    point.x >= element.position.x &&
    point.x <= element.position.x + width &&
    point.y >= element.position.y &&
    point.y <= element.position.y + height
  );
}

function distanceToLineSegment(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return distance(point, lineStart);
  }

  let t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));

  const projection = {
    x: lineStart.x + t * dx,
    y: lineStart.y + t * dy,
  };

  return distance(point, projection);
}

function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
