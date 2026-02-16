import { create } from 'zustand';
import { WhiteboardElement, Viewport } from '@/canvas/types';
import { ToolType, ToolSettings } from '@/tools/toolTypes';
import { createHistory, HistoryState } from './history';
import { BoardBackground } from '@/backend';

interface BoardState {
  elements: WhiteboardElement[];
  selectedElements: string[];
  activeTool: ToolType;
  toolSettings: ToolSettings;
  viewport: Viewport;
  history: HistoryState<WhiteboardElement[]>;
  backgroundMode: BoardBackground;
  
  // Actions
  setElements: (elements: WhiteboardElement[]) => void;
  addElement: (element: WhiteboardElement) => void;
  updateElement: (id: string, updates: Partial<WhiteboardElement>) => void;
  deleteElement: (id: string) => void;
  deleteSelected: () => void;
  setSelectedElements: (ids: string[]) => void;
  setActiveTool: (tool: ToolType) => void;
  setToolSettings: (settings: Partial<ToolSettings>) => void;
  setViewport: (viewport: Viewport) => void;
  setBackgroundMode: (mode: BoardBackground) => void;
  undo: () => void;
  redo: () => void;
  clearBoard: () => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  elements: [],
  selectedElements: [],
  activeTool: 'select',
  toolSettings: {
    strokeSize: 2,
    strokeColor: { r: 0, g: 0, b: 0, a: 1 },
    fillColor: { r: 255, g: 255, b: 255, a: 0 },
  },
  viewport: { x: 0, y: 0, zoom: 1 },
  history: createHistory([]),
  backgroundMode: BoardBackground.blank,

  setElements: (elements) => {
    set({ elements });
  },

  addElement: (element) => {
    set((state) => {
      const newElements = [...state.elements, element];
      return {
        elements: newElements,
        history: {
          past: [...state.history.past, state.elements],
          present: newElements,
          future: [],
        },
      };
    });
  },

  updateElement: (id, updates) => {
    set((state) => {
      const newElements = state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } as WhiteboardElement : el
      );
      return {
        elements: newElements,
        history: {
          past: [...state.history.past, state.elements],
          present: newElements,
          future: [],
        },
      };
    });
  },

  deleteElement: (id) => {
    set((state) => {
      const newElements = state.elements.filter((el) => el.id !== id);
      return {
        elements: newElements,
        selectedElements: state.selectedElements.filter((selId) => selId !== id),
        history: {
          past: [...state.history.past, state.elements],
          present: newElements,
          future: [],
        },
      };
    });
  },

  deleteSelected: () => {
    const { selectedElements } = get();
    if (selectedElements.length === 0) return;

    set((state) => {
      const newElements = state.elements.filter(
        (el) => !selectedElements.includes(el.id)
      );
      return {
        elements: newElements,
        selectedElements: [],
        history: {
          past: [...state.history.past, state.elements],
          present: newElements,
          future: [],
        },
      };
    });
  },

  setSelectedElements: (ids) => {
    set({ selectedElements: ids });
  },

  setActiveTool: (tool) => {
    set({ activeTool: tool, selectedElements: [] });
  },

  setToolSettings: (settings) => {
    set((state) => ({
      toolSettings: { ...state.toolSettings, ...settings },
    }));
  },

  setViewport: (viewport) => {
    set({ viewport });
  },

  setBackgroundMode: (mode) => {
    set({ backgroundMode: mode });
  },

  undo: () => {
    set((state) => {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      return {
        elements: previous,
        history: {
          past: newPast,
          present: previous,
          future: [state.elements, ...state.history.future],
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        elements: next,
        history: {
          past: [...state.history.past, state.elements],
          present: next,
          future: newFuture,
        },
      };
    });
  },

  clearBoard: () => {
    set((state) => ({
      elements: [],
      selectedElements: [],
      history: {
        past: [...state.history.past, state.elements],
        present: [],
        future: [],
      },
    }));
  },
}));
