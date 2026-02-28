import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { SpeechAnalysis, SpeechAnalysisInsert } from '@/types/database';

import { useAuth } from './useAuth';

export const useSpeechAnalysisList = () => {
  const { user } = useAuth();

  return useQuery<SpeechAnalysis[]>({
    queryKey: ['speech-analysis-list', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID is required');

      const { data, error } = await supabase
        .from('speech_analyses')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useSpeechAnalysisDetail = (id: string | undefined) => {
  return useQuery<SpeechAnalysis>({
    queryKey: ['speech-analysis-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('speech_analyses')
        .select('*')
        .eq('id', id!)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateSpeechAnalysis = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: Omit<SpeechAnalysisInsert, 'profile_id' | 'timezone'>
    ) => {
      if (!user?.id) throw new Error('Not authenticated');

      const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';

      const { data, error } = await supabase
        .from('speech_analyses')
        .insert({ ...input, profile_id: user.id, timezone })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['speech-analysis-list', user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['profile', user?.id],
      });
    },
  });
};

export const useDeleteSpeechAnalysis = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('speech_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({
        queryKey: ['speech-analysis-list', user?.id],
      });
      queryClient.removeQueries({
        queryKey: ['speech-analysis-detail', deletedId],
      });
    },
  });
};
