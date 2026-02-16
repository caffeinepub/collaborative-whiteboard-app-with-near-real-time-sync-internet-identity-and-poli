import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Toggle } from '@/components/ui/toggle';
import { useBoardStore } from '@/state/boardStore';
import { ToolType } from '@/tools/toolTypes';
import {
  MousePointer2,
  Pencil,
  Eraser,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Type,
  StickyNote,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const tools: Array<{ type: ToolType; icon: any; label: string }> = [
  { type: 'select', icon: MousePointer2, label: 'Select (V)' },
  { type: 'pen', icon: Pencil, label: 'Pen (P)' },
  { type: 'eraser', icon: Eraser, label: 'Eraser (E)' },
  { type: 'rectangle', icon: Square, label: 'Rectangle (R)' },
  { type: 'ellipse', icon: Circle, label: 'Ellipse (O)' },
  { type: 'line', icon: Minus, label: 'Line (L)' },
  { type: 'arrow', icon: ArrowRight, label: 'Arrow (A)' },
  { type: 'text', icon: Type, label: 'Text (T)' },
  { type: 'sticky', icon: StickyNote, label: 'Sticky Note (S)' },
];

export function ToolBar() {
  const activeTool = useBoardStore((state) => state.activeTool);
  const setActiveTool = useBoardStore((state) => state.setActiveTool);
  const undo = useBoardStore((state) => state.undo);
  const redo = useBoardStore((state) => state.redo);
  const viewport = useBoardStore((state) => state.viewport);
  const setViewport = useBoardStore((state) => state.setViewport);
  const canUndo = useBoardStore((state) => state.history.past.length > 0);
  const canRedo = useBoardStore((state) => state.history.future.length > 0);

  const handleZoomIn = () => {
    setViewport({ ...viewport, zoom: Math.min(5, viewport.zoom * 1.2) });
  };

  const handleZoomOut = () => {
    setViewport({ ...viewport, zoom: Math.max(0.1, viewport.zoom / 1.2) });
  };

  return (
    <TooltipProvider>
      <div className="w-16 border-r border-border/40 bg-card/80 backdrop-blur-sm flex flex-col items-center py-4 gap-2">
        {tools.map((tool) => (
          <Tooltip key={tool.type}>
            <TooltipTrigger asChild>
              <Toggle
                pressed={activeTool === tool.type}
                onPressedChange={() => setActiveTool(tool.type)}
                className="w-12 h-12"
              >
                <tool.icon className="w-5 h-5" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <Separator className="my-2 w-10" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={!canUndo}
              className="w-12 h-12"
            >
              <Undo className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Undo (Ctrl+Z)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={!canRedo}
              className="w-12 h-12"
            >
              <Redo className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Redo (Ctrl+Y)</p>
          </TooltipContent>
        </Tooltip>

        <Separator className="my-2 w-10" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="w-12 h-12"
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="w-12 h-12"
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
