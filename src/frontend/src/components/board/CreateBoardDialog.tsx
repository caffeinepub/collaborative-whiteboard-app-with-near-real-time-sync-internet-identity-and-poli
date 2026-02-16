import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BoardBackground } from '@/backend';
import { FileText, Circle, Grid3x3, AlignLeft } from 'lucide-react';

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, background: BoardBackground) => void;
}

const templates = [
  {
    id: BoardBackground.blank,
    name: 'Blank',
    icon: FileText,
    description: 'Clean canvas',
  },
  {
    id: BoardBackground.dots,
    name: 'Dots',
    icon: Circle,
    description: 'Dot pattern',
  },
  {
    id: BoardBackground.grid,
    name: 'Grid',
    icon: Grid3x3,
    description: 'Square grid',
  },
  {
    id: BoardBackground.lines,
    name: 'Lines',
    icon: AlignLeft,
    description: 'Ruled lines',
  },
];

export function CreateBoardDialog({ open, onOpenChange, onCreate }: CreateBoardDialogProps) {
  const [boardName, setBoardName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<BoardBackground>(BoardBackground.blank);

  const handleCreate = () => {
    if (boardName.trim()) {
      onCreate(boardName.trim(), selectedTemplate);
      setBoardName('');
      setSelectedTemplate(BoardBackground.blank);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setBoardName('');
    setSelectedTemplate(BoardBackground.blank);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>
            Choose a name and template for your board
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Board Name Input */}
          <div className="space-y-2">
            <Label htmlFor="board-name">Board Name</Label>
            <Input
              id="board-name"
              placeholder="My Awesome Board"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label>Template</Label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedTemplate === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`
                      relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all
                      ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-accent/5'
                      }
                    `}
                  >
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        ${isSelected ? 'bg-primary/10' : 'bg-muted'}
                      `}
                    >
                      <Icon
                        className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!boardName.trim()}>
            Create Board
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
