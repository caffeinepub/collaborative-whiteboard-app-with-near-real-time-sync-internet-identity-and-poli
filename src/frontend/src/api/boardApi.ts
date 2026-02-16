import { useActor } from '@/hooks/useActor';
import { Operation, BoardId, BoardBackground } from '@/backend';

export function useBoardApi() {
  const { actor } = useActor();

  return {
    createBoard: async (boardId: BoardId, background: BoardBackground) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createBoard(boardId, background);
    },

    getBoardSnapshot: async (boardId: BoardId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getBoardSnapshot(boardId);
    },

    appendOperation: async (boardId: BoardId, operation: Operation) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.appendOperation(boardId, operation);
    },

    getChangesSinceVersion: async (boardId: BoardId, version: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getChangesSinceVersion(boardId, version);
    },

    updateBoardBackground: async (boardId: BoardId, background: BoardBackground) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateBoardBackground(boardId, background);
    },
  };
}
