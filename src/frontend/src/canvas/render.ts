import { WhiteboardElement, Viewport, Point } from './types';
import { worldToScreen } from './viewport';
import { BoardBackground } from '@/backend';

export function renderCanvas(
  ctx: CanvasRenderingContext2D,
  elements: WhiteboardElement[],
  viewport: Viewport,
  width: number,
  height: number,
  backgroundMode: BoardBackground = BoardBackground.blank
) {
  // Clear canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Render background pattern
  renderBackground(ctx, viewport, width, height, backgroundMode);

  // Save context
  ctx.save();

  // Render each element
  elements.forEach((element) => {
    renderElement(ctx, element, viewport);
  });

  // Restore context
  ctx.restore();
}

function renderBackground(
  ctx: CanvasRenderingContext2D,
  viewport: Viewport,
  width: number,
  height: number,
  mode: BoardBackground
) {
  ctx.save();

  switch (mode) {
    case BoardBackground.blank:
      // Already filled with white, nothing more to do
      break;

    case BoardBackground.dots:
      renderDots(ctx, viewport, width, height);
      break;

    case BoardBackground.grid:
      renderGrid(ctx, viewport, width, height);
      break;

    case BoardBackground.lines:
      renderLines(ctx, viewport, width, height);
      break;
  }

  ctx.restore();
}

function renderDots(
  ctx: CanvasRenderingContext2D,
  viewport: Viewport,
  width: number,
  height: number
) {
  const spacing = 30 * viewport.zoom;
  const dotRadius = 1.5;

  // Calculate offset based on viewport position to anchor to world coordinates
  const offsetX = (viewport.x * viewport.zoom) % spacing;
  const offsetY = (viewport.y * viewport.zoom) % spacing;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';

  for (let x = offsetX; x < width; x += spacing) {
    for (let y = offsetY; y < height; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function renderGrid(
  ctx: CanvasRenderingContext2D,
  viewport: Viewport,
  width: number,
  height: number
) {
  const spacing = 30 * viewport.zoom;

  // Calculate offset based on viewport position to anchor to world coordinates
  const offsetX = (viewport.x * viewport.zoom) % spacing;
  const offsetY = (viewport.y * viewport.zoom) % spacing;

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = offsetX; x < width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = offsetY; y < height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function renderLines(
  ctx: CanvasRenderingContext2D,
  viewport: Viewport,
  width: number,
  height: number
) {
  const spacing = 40 * viewport.zoom;

  // Calculate offset based on viewport position to anchor to world coordinates
  const offsetY = (viewport.y * viewport.zoom) % spacing;

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = 1;

  // Horizontal ruled lines
  for (let y = offsetY; y < height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function renderElement(ctx: CanvasRenderingContext2D, element: WhiteboardElement, viewport: Viewport) {
  ctx.save();

  switch (element.type) {
    case 'stroke':
      renderStroke(ctx, element, viewport);
      break;
    case 'rectangle':
      renderRectangle(ctx, element, viewport);
      break;
    case 'ellipse':
      renderEllipse(ctx, element, viewport);
      break;
    case 'line':
      renderLine(ctx, element, viewport);
      break;
    case 'arrow':
      renderArrow(ctx, element, viewport);
      break;
    case 'text':
      renderText(ctx, element, viewport);
      break;
    case 'sticky':
      renderSticky(ctx, element, viewport);
      break;
  }

  ctx.restore();
}

function renderStroke(ctx: CanvasRenderingContext2D, element: any, viewport: Viewport) {
  if (element.points.length < 2) return;

  const color = element.color;
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  ctx.lineWidth = element.size * viewport.zoom;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  const start = worldToScreen(element.points[0].x, element.points[0].y, viewport);
  ctx.moveTo(start.x, start.y);

  for (let i = 1; i < element.points.length; i++) {
    const point = worldToScreen(element.points[i].x, element.points[i].y, viewport);
    ctx.lineTo(point.x, point.y);
  }

  ctx.stroke();
}

function renderRectangle(ctx: CanvasRenderingContext2D, element: any, viewport: Viewport) {
  const start = worldToScreen(element.start.x, element.start.y, viewport);
  const end = worldToScreen(element.end.x, element.end.y, viewport);
  const width = end.x - start.x;
  const height = end.y - start.y;

  const color = element.color;
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  ctx.lineWidth = element.size * viewport.zoom;
  ctx.strokeRect(start.x, start.y, width, height);
}

function renderEllipse(ctx: CanvasRenderingContext2D, element: any, viewport: Viewport) {
  const start = worldToScreen(element.start.x, element.start.y, viewport);
  const end = worldToScreen(element.end.x, element.end.y, viewport);
  const centerX = (start.x + end.x) / 2;
  const centerY = (start.y + end.y) / 2;
  const radiusX = Math.abs(end.x - start.x) / 2;
  const radiusY = Math.abs(end.y - start.y) / 2;

  const color = element.color;
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  ctx.lineWidth = element.size * viewport.zoom;

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.stroke();
}

function renderLine(ctx: CanvasRenderingContext2D, element: any, viewport: Viewport) {
  const start = worldToScreen(element.start.x, element.start.y, viewport);
  const end = worldToScreen(element.end.x, element.end.y, viewport);

  const color = element.color;
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  ctx.lineWidth = element.size * viewport.zoom;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function renderArrow(ctx: CanvasRenderingContext2D, element: any, viewport: Viewport) {
  const start = worldToScreen(element.start.x, element.start.y, viewport);
  const end = worldToScreen(element.end.x, element.end.y, viewport);

  const color = element.color;
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  ctx.lineWidth = element.size * viewport.zoom;
  ctx.lineCap = 'round';

  // Draw line
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  // Draw arrowhead
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const arrowLength = 15 * viewport.zoom;
  const arrowAngle = Math.PI / 6;

  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(
    end.x - arrowLength * Math.cos(angle - arrowAngle),
    end.y - arrowLength * Math.sin(angle - arrowAngle)
  );
  ctx.lineTo(
    end.x - arrowLength * Math.cos(angle + arrowAngle),
    end.y - arrowLength * Math.sin(angle + arrowAngle)
  );
  ctx.closePath();
  ctx.fill();
}

function renderText(ctx: CanvasRenderingContext2D, element: any, viewport: Viewport) {
  const pos = worldToScreen(element.position.x, element.position.y, viewport);
  const fontSize = element.fontSize * viewport.zoom;

  const color = element.color;
  ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  ctx.font = `${fontSize}px Inter, sans-serif`;
  ctx.textBaseline = 'top';

  ctx.fillText(element.text, pos.x, pos.y);
}

function renderSticky(ctx: CanvasRenderingContext2D, element: any, viewport: Viewport) {
  const pos = worldToScreen(element.position.x, element.position.y, viewport);
  const width = (element.width || 200) * viewport.zoom;
  const height = (element.height || 200) * viewport.zoom;
  const fontSize = element.fontSize * viewport.zoom;

  // Draw sticky note background
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(pos.x, pos.y, width, height);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.strokeRect(pos.x, pos.y, width, height);

  // Draw text
  ctx.fillStyle = '#000000';
  ctx.font = `${fontSize}px Inter, sans-serif`;
  ctx.textBaseline = 'top';

  const padding = 10 * viewport.zoom;
  const lines = element.text.split('\n');
  lines.forEach((line: string, i: number) => {
    ctx.fillText(line, pos.x + padding, pos.y + padding + i * fontSize * 1.2, width - padding * 2);
  });
}
