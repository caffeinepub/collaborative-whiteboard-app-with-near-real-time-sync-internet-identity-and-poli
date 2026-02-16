import { Point } from '@/canvas/types';
import { useBoardStore } from '@/state/boardStore';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { hitTestElement } from '@/canvas/hitTest';

let currentStroke: Point[] = [];
let currentShapeStart: Point | null = null;

export function handlePointerDown(point: Point, boardId: string) {
  const state = useBoardStore.getState();
  const tool = state.activeTool;

  if (tool === 'select') {
    // Find clicked element
    const clickedElement = state.elements
      .slice()
      .reverse()
      .find((el) => hitTestElement(el, point));

    if (clickedElement) {
      state.setSelectedElements([clickedElement.id]);
    } else {
      state.setSelectedElements([]);
    }
  } else if (tool === 'pen') {
    currentStroke = [point];
  } else if (['rectangle', 'ellipse', 'line', 'arrow'].includes(tool)) {
    currentShapeStart = point;
  }
}

export function handlePointerMove(point: Point, boardId: string) {
  const state = useBoardStore.getState();
  const tool = state.activeTool;

  if (tool === 'pen' && currentStroke.length > 0) {
    currentStroke.push(point);
    // Update preview (simplified - just add to elements temporarily)
  }
}

export function handlePointerUp(point: Point, boardId: string) {
  const state = useBoardStore.getState();
  const tool = state.activeTool;
  const settings = state.toolSettings;

  if (tool === 'pen' && currentStroke.length > 1) {
    const element = {
      id: `stroke-${Date.now()}-${Math.random()}`,
      type: 'stroke' as const,
      points: currentStroke,
      color: settings.strokeColor,
      size: settings.strokeSize,
      timestamp: Date.now(),
    };
    state.addElement(element);
    currentStroke = [];
  } else if (
    ['rectangle', 'ellipse', 'line', 'arrow'].includes(tool) &&
    currentShapeStart
  ) {
    const element = {
      id: `${tool}-${Date.now()}-${Math.random()}`,
      type: tool as any,
      start: currentShapeStart,
      end: point,
      color: settings.strokeColor,
      size: settings.strokeSize,
      timestamp: Date.now(),
    };
    state.addElement(element);
    currentShapeStart = null;
  }
}
