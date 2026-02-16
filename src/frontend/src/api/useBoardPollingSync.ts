import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { applyRemoteOperations } from '@/state/applyRemoteOps';
import { useBoardStore } from '@/state/boardStore';

const POLL_INTERVAL = 2000; // 2 seconds

export function useBoardPollingSync(boardId: string) {
  const { actor } = useActor();
  const [lastVersion, setLastVersion] = useState<bigint>(BigInt(0));
  const [isPolling, setIsPolling] = useState(false);
  const setBackgroundMode = useBoardStore((state) => state.setBackgroundMode);

  const { data } = useQuery({
    queryKey: ['board-changes', boardId, lastVersion.toString()],
    queryFn: async () => {
      if (!actor) return null;
      const changes = await actor.getChangesSinceVersion(boardId, lastVersion);
      
      if (changes && changes.operations.length > 0) {
        applyRemoteOperations(changes.operations);
        setLastVersion(changes.version);
      } else if (changes) {
        setLastVersion(changes.version);
      }

      // Update background mode if it changed
      if (changes) {
        setBackgroundMode(changes.background);
      }

      return changes;
    },
    enabled: !!actor && !!boardId,
    refetchInterval: POLL_INTERVAL,
  });

  useEffect(() => {
    setIsPolling(!!actor && !!boardId);
  }, [actor, boardId]);

  return { isPolling };
}
