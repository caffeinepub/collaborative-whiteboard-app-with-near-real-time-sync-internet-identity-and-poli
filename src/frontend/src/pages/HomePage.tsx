import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LogoMark } from '@/components/branding/LogoMark';
import { AuthButton } from '@/components/auth/AuthButton';
import { CreateBoardDialog } from '@/components/board/CreateBoardDialog';
import { Plus, LogIn, Clock } from 'lucide-react';
import { getRecentBoards, openRecentBoard } from '@/state/recentBoards';
import { SiGithub } from 'react-icons/si';
import { BoardBackground } from '@/backend';

interface HomePageProps {
  onNavigateToBoard: (boardId: string, initialTitle?: string, initialBackground?: BoardBackground) => void;
}

export function HomePage({ onNavigateToBoard }: HomePageProps) {
  const [joinCode, setJoinCode] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const recentBoards = getRecentBoards();

  const handleCreateBoard = (name: string, background: BoardBackground) => {
    const newBoardId = `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    onNavigateToBoard(newBoardId, name, background);
  };

  const handleJoinBoard = () => {
    if (joinCode.trim()) {
      onNavigateToBoard(joinCode.trim());
    }
  };

  const handleOpenRecent = (boardId: string) => {
    openRecentBoard(boardId);
    onNavigateToBoard(boardId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark size={40} />
            <div>
              <h1 className="text-xl font-bold">CollabBoard</h1>
              <p className="text-xs text-muted-foreground">Real-time whiteboard</p>
            </div>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold tracking-tight">
              Create & Collaborate
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A real-time collaborative whiteboard for teams. Draw, sketch, and brainstorm together.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Board */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Create New Board
                </CardTitle>
                <CardDescription>
                  Start a fresh whiteboard and invite others to collaborate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowCreateDialog(true)} 
                  className="w-full" 
                  size="lg"
                >
                  Create Board
                </Button>
              </CardContent>
            </Card>

            {/* Join Board */}
            <Card className="border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-accent" />
                  Join Existing Board
                </CardTitle>
                <CardDescription>
                  Enter a board code to join a collaborative session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Enter board code..."
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinBoard()}
                />
                <Button 
                  onClick={handleJoinBoard} 
                  variant="secondary"
                  className="w-full" 
                  size="lg"
                  disabled={!joinCode.trim()}
                >
                  Join Board
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Boards */}
          {recentBoards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Boards
                </CardTitle>
                <CardDescription>
                  Continue where you left off
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentBoards.map((board) => (
                    <button
                      key={board.id}
                      onClick={() => handleOpenRecent(board.id)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent/10 hover:border-accent/50 transition-colors"
                    >
                      <div className="font-medium">{board.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Last opened: {new Date(board.lastOpenedAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Built with ❤️ using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <CreateBoardDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreate={handleCreateBoard}
      />
    </div>
  );
}
