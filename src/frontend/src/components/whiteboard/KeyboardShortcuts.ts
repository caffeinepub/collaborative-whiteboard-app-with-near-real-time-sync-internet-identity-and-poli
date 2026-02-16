import { useEffect } from 'react';
import { useBoardStore } from '@/state/boardStore';
import { ToolType } from '@/tools/toolTypes';

const toolShortcuts: Record<string, ToolType> = {
  v: 'select',
  p: 'pen',
  e: 'eraser',
  r: 'rectangle',
  o: 'ellipse',
  l: 'line',
  a: 'arrow',
  t: 'text',
  s: 'sticky',
};

export function useKeyboardShortcuts() {
  const setActiveTool = useBoardStore((state) => state.setActiveTool);
  const undo = useBoardStore((state) => state.undo);
  const redo = useBoardStore((state) => state.redo);
  const deleteSelected = useBoardStore((state) => state.deleteSelected);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }

      // Tool shortcuts
      const tool = toolShortcuts[e.key.toLowerCase()];
      if (tool) {
        e.preventDefault();
        setActiveTool(tool);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTool, undo, redo, deleteSelected]);
}
