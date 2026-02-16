interface RecentBoard {
  id: string;
  title: string;
  lastOpenedAt: number;
}

const STORAGE_KEY = 'collabboard_recent_boards';
const MAX_RECENT = 10;

export function getRecentBoards(): RecentBoard[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addRecentBoard(id: string, title: string) {
  const boards = getRecentBoards();
  const existing = boards.findIndex((b) => b.id === id);

  if (existing >= 0) {
    boards.splice(existing, 1);
  }

  boards.unshift({
    id,
    title,
    lastOpenedAt: Date.now(),
  });

  const trimmed = boards.slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function openRecentBoard(id: string) {
  const boards = getRecentBoards();
  const board = boards.find((b) => b.id === id);
  if (board) {
    addRecentBoard(board.id, board.title);
  }
}

export function removeRecentBoard(id: string) {
  const boards = getRecentBoards().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}
