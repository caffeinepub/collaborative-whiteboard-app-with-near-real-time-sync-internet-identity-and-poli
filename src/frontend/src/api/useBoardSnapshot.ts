import { useQuery } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { useBoardStore } from '@/state/boardStore';
import { applyRemoteOperations } from '@/state/applyRemoteOps';
import { BoardBackground } from '@/backend';

export function useBoardSnapshot(boardId: string, initialBackground?: BoardBackground) {
  const { actor, isFetching } = useActor();
  const setBackgroundMode = useBoardStore((state) => state.setBackgroundMode);

  return useQuery({
    queryKey: ['board-snapshot', boardId],
    queryFn: async () => {
      if (!actor) return null;

      // Try to get existing board
      let snapshot = await actor.getBoardSnapshot(boardId);

      // If board doesn't exist, create it with the initial background
      if (!snapshot) {
        const background = initialBackground || BoardBackground.blank;
        await actor.createBoard(boardId, background);
        snapshot = await actor.getBoardSnapshot(boardId);
      }

      if (snapshot) {
        // Apply operations to local state
        applyRemoteOperations(snapshot.operations);
        // Set background mode from snapshot
        setBackgroundMode(snapshot.background);
      }

      return snapshot;
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}
