import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { BoardPage } from './pages/BoardPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { BoardBackground } from '@/backend';

export type AppView = 'home' | 'board';

function App() {
  const [view, setView] = useState<AppView>('home');
  const [boardId, setBoardId] = useState<string>('');
  const [initialTitle, setInitialTitle] = useState<string | undefined>();
  const [initialBackground, setInitialBackground] = useState<BoardBackground | undefined>();

  const navigateToBoard = (id: string, title?: string, background?: BoardBackground) => {
    setBoardId(id);
    setInitialTitle(title);
    setInitialBackground(background);
    setView('board');
  };

  const navigateToHome = () => {
    setView('home');
    setBoardId('');
    setInitialTitle(undefined);
    setInitialBackground(undefined);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen whiteboard-bg">
        {view === 'home' && <HomePage onNavigateToBoard={navigateToBoard} />}
        {view === 'board' && boardId && (
          <BoardPage 
            boardId={boardId} 
            onNavigateHome={navigateToHome}
            initialTitle={initialTitle}
            initialBackground={initialBackground}
          />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
