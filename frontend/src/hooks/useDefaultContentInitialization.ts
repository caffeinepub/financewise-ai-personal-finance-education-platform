import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Mock initialization since backend doesn't have initializeSystem method
export function useInitializeDefaultContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success - content is generated on-demand in useQueries
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPreviews'] });
      queryClient.invalidateQueries({ queryKey: ['quizQuestion'] });
      queryClient.invalidateQueries({ queryKey: ['quizStatistics'] });
      toast.success('Content initialized successfully');
    },
    onError: (error: any) => {
      console.error('Initialization error:', error);
      toast.error('Failed to initialize content');
    },
  });
}
