import { useEffect, useRef, useState } from 'react';
import { useBoardStore } from '@/state/boardStore';
import { renderCanvas } from '@/canvas/render';
import { screenToWorld, worldToScreen } from '@/canvas/viewport';
import { handlePointerDown, handlePointerMove, handlePointerUp } from '@/tools/toolHandler';
import { useKeyboardShortcuts } from './KeyboardShortcuts';

interface WhiteboardCanvasProps {
  boardId: string;
}

export function WhiteboardCanvas({ boardId }: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  
  const viewport = useBoardStore((state) => state.viewport);
  const elements = useBoardStore((state) => state.elements);
  const activeTool = useBoardStore((state) => state.activeTool);
  const backgroundMode = useBoardStore((state) => state.backgroundMode);
  const setViewport = useBoardStore((state) => state.setViewport);

  useKeyboardShortcuts();

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    renderCanvas(ctx, elements, viewport, canvasRef.current.width, canvasRef.current.height, backgroundMode);
  }, [elements, viewport, backgroundMode]);

  // Zoom handling
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, viewport.zoom * delta));
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const worldBefore = screenToWorld(mouseX, mouseY, viewport);
    const newViewport = { ...viewport, zoom: newZoom };
    const worldAfter = screenToWorld(mouseX, mouseY, newViewport);
    
    setViewport({
      ...newViewport,
      x: viewport.x + (worldAfter.x - worldBefore.x),
      y: viewport.y + (worldAfter.y - worldBefore.y),
    });
  };

  const getPointerPosition = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return screenToWorld(e.clientX - rect.left, e.clientY - rect.top, viewport);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsPointerDown(true);
    const pos = getPointerPosition(e);
    handlePointerDown(pos, boardId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown) return;
    const pos = getPointerPosition(e);
    handlePointerMove(pos, boardId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown) return;
    setIsPointerDown(false);
    const pos = getPointerPosition(e);
    handlePointerUp(pos, boardId);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full canvas-container"
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
    </div>
  );
}
