import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { BadgeEventKey, MyBadge } from '@/types/database';

import { useAuth } from './useAuth';

export const getMyBadgesQueryKey = (userId: string | undefined) =>
  ['my-badges', userId] as const;

export const useMyBadges = () => {
  const { user } = useAuth();

  return useQuery<MyBadge[]>({
    queryKey: getMyBadgesQueryKey(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_my_badges');

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.id,
  });
};

export const useRecordBadgeEvent = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventKey: BadgeEventKey) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('record_badge_event', {
        p_event_key: eventKey,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMyBadgesQueryKey(user?.id),
      });
    },
  });
};
