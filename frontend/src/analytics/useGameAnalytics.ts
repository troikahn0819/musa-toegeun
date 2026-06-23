import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  completeAnalyticsSession,
  isAnalyticsConfigured,
  recordChoice,
  startAnalyticsSession,
} from './api';

export function useGameAnalytics() {
  const queryClient = useQueryClient();
  const start = useMutation({ mutationFn: startAnalyticsSession });
  const choice = useMutation({
    mutationFn: recordChoice,
    onSuccess: (statistics, variables) => {
      queryClient.setQueryData(['choice-statistics', variables.cardId], statistics);
    },
  });
  const complete = useMutation({
    mutationFn: completeAnalyticsSession,
    onSuccess: (statistic) => {
      if (statistic) queryClient.setQueryData(['ending-statistic', statistic.endingId], statistic);
    },
  });

  return {
    configured: isAnalyticsConfigured,
    start,
    choice,
    complete,
    resetRun() {
      start.reset();
      choice.reset();
      complete.reset();
    },
  };
}

