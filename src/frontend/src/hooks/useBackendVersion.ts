import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

/**
 * React Query hook to fetch backend version from the actor
 */
export function useBackendVersion() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['backendVersion'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBackendVersion();
    },
    enabled: !!actor && !actorFetching,
    staleTime: Infinity, // Version doesn't change during runtime
    retry: 1,
  });
}
