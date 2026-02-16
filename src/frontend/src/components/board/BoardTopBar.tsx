import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ShareDialog } from './ShareDialog';
import { LogoMark } from '@/components/branding/LogoMark';
import { AuthButton } from '@/components/auth/AuthButton';
import { Home, Share2, Download, MoreVertical, FileJson, Image as ImageIcon, FileText, Circle, Grid3x3, AlignLeft } from 'lucide-react';
import { exportToPNG, exportToJSON } from '@/utils/exporters';
import { useBoardStore } from '@/state/boardStore';
import { toast } from 'sonner';
import { BoardBackground } from '@/backend';
import { useActor } from '@/hooks/useActor';

interface BoardTopBarProps {
  boardId: string;
  boardTitle: string;
  onTitleChange: (title: string) => void;
  onNavigateHome: () => void;
  isPolling: boolean;
}

const backgroundOptions = [
  { id: BoardBackground.blank, name: 'Blank', icon: FileText },
  { id: BoardBackground.dots, name: 'Dots', icon: Circle },
  { id: BoardBackground.grid, name: 'Grid', icon: Grid3x3 },
  { id: BoardBackground.lines, name: 'Lines', icon: AlignLeft },
];

export function BoardTopBar({
  boardId,
  boardTitle,
  onTitleChange,
  onNavigateHome,
  isPolling,
}: BoardTopBarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const elements = useBoardStore((state) => state.elements);
  const backgroundMode = useBoardStore((state) => state.backgroundMode);
  const setBackgroundMode = useBoardStore((state) => state.setBackgroundMode);
  const { actor } = useActor();

  const handleExportPNG = async () => {
    try {
      await exportToPNG();
      toast.success('Exported as PNG');
    } catch (error) {
      toast.error('Failed to export PNG');
    }
  };

  const handleExportJSON = () => {
    try {
      exportToJSON(elements);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to export JSON');
    }
  };

  const handleBackgroundChange = async (background: BoardBackground) => {
    if (!actor) {
      toast.error('Not connected');
      return;
    }

    try {
      // Optimistic update
      setBackgroundMode(background);
      
      // Persist to backend
      await actor.updateBoardBackground(boardId, background);
      toast.success('Background updated');
    } catch (error) {
      toast.error('Failed to update background');
      console.error('Background update error:', error);
    }
  };

  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigateHome}
            title="Home"
          >
            <Home className="w-5 h-5" />
          </Button>

          <LogoMark size={32} />

          {isEditing ? (
            <Input
              value={boardTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              className="w-64"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-lg font-semibold hover:text-primary transition-colors"
            >
              {boardTitle}
            </button>
          )}

          {isPolling && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Live</span>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Background Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {backgroundOptions.find((opt) => opt.id === backgroundMode)?.icon && (
                  <>
                    {(() => {
                      const Icon = backgroundOptions.find((opt) => opt.id === backgroundMode)!.icon;
                      return <Icon className="w-4 h-4 mr-2" />;
                    })()}
                  </>
                )}
                Background
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Background Template</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {backgroundOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => handleBackgroundChange(option.id)}
                    className={backgroundMode === option.id ? 'bg-accent' : ''}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {option.name}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPNG}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>
                <FileJson className="w-4 h-4 mr-2" />
                Copy as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AuthButton />
        </div>
      </div>

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        boardId={boardId}
      />
    </header>
  );
}
