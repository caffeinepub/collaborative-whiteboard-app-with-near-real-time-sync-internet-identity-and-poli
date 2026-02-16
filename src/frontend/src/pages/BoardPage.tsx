import { useEffect, useRef, useState } from 'react';
import { WhiteboardCanvas } from '@/components/whiteboard/WhiteboardCanvas';
import { ToolBar } from '@/components/whiteboard/ToolBar';
import { BoardTopBar } from '@/components/board/BoardTopBar';
import { ParticipantsPanel } from '@/components/board/ParticipantsPanel';
import { InspectorPanel } from '@/components/whiteboard/InspectorPanel';
import { useBoardSnapshot } from '@/api/useBoardSnapshot';
import { useBoardPollingSync } from '@/api/useBoardPollingSync';
import { useBoardStore } from '@/state/boardStore';
import { addRecentBoard } from '@/state/recentBoards';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Loader2 } from 'lucide-react';
import { BoardBackground } from '@/backend';

interface BoardPageProps {
  boardId: string;
  onNavigateHome: () => void;
  initialTitle?: string;
  initialBackground?: BoardBackground;
}

export function BoardPage({ boardId, onNavigateHome, initialTitle, initialBackground }: BoardPageProps) {
  const { identity } = useInternetIdentity();
  const { data: snapshot, isLoading, error } = useBoardSnapshot(boardId, initialBackground);
  const { isPolling } = useBoardPollingSync(boardId);
  const [boardTitle, setBoardTitle] = useState(initialTitle || 'Untitled Board');
  const initRef = useRef(false);
  const selectedElements = useBoardStore((state) => state.selectedElements);

  useEffect(() => {
    if (snapshot && !initRef.current) {
      initRef.current = true;
      addRecentBoard(boardId, boardTitle);
    }
  }, [snapshot, boardId, boardTitle]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Failed to load board</p>
          <button onClick={onNavigateHome} className="text-primary hover:underline">
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <BoardTopBar
        boardId={boardId}
        boardTitle={boardTitle}
        onTitleChange={setBoardTitle}
        onNavigateHome={onNavigateHome}
        isPolling={isPolling}
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        <ToolBar />
        
        <div className="flex-1 relative">
          <WhiteboardCanvas boardId={boardId} />
        </div>

        {selectedElements.length > 0 && (
          <InspectorPanel />
        )}

        <ParticipantsPanel boardId={boardId} />
      </div>
    </div>
  );
}
