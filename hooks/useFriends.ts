import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type {
  FriendProfile,
  FriendRequest,
  FriendStats,
  SearchedProfile,
} from '@/types/database';

import { useAuth } from './useAuth';

export const useFriendList = () => {
  const { user } = useAuth();

  return useQuery<FriendProfile[]>({
    queryKey: ['friend-list', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_friend_profiles');

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useFriendRequests = () => {
  const { user } = useAuth();

  return useQuery<FriendRequest[]>({
    queryKey: ['friend-requests', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_friend_requests');

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useFriendStats = (profileId: string | undefined) => {
  return useQuery<FriendStats | null>({
    queryKey: ['friend-stats', profileId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_friend_stats', {
        target_profile_id: profileId!,
      });

      if (error) throw error;
      return data?.[0] ?? null;
    },
    enabled: !!profileId,
  });
};

export const useSearchProfiles = (query: string) => {
  return useQuery<SearchedProfile[]>({
    queryKey: ['search-profiles', query],
    queryFn: async () => {
      const isEmail = query.includes('@');
      const { data, error } = isEmail
        ? await supabase.rpc('search_profile_by_email', { search_email: query })
        : await supabase.rpc('search_profile_by_username', {
            search_username: query,
          });

      if (error) throw error;
      return data;
    },
    enabled: query.length >= 2,
  });
};

export const useSendFriendRequest = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (receiverId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('friendships')
        .insert({ receiver_id: receiverId, sender_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-list', user?.id] });
      queryClient.invalidateQueries({
        queryKey: ['friend-requests', user?.id],
      });
    },
  });
};

export const useRespondToFriendRequest = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'accepted' | 'rejected';
    }) => {
      const { error } = await supabase
        .from('friendships')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-list', user?.id] });
      queryClient.invalidateQueries({
        queryKey: ['friend-requests', user?.id],
      });
    },
  });
};

export const useRemoveFriend = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendProfileId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('friendships')
        .delete()
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${friendProfileId}),and(sender_id.eq.${friendProfileId},receiver_id.eq.${user.id})`
        )
        .eq('status', 'accepted');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-list', user?.id] });
      queryClient.invalidateQueries({
        queryKey: ['friend-requests', user?.id],
      });
    },
  });
};
