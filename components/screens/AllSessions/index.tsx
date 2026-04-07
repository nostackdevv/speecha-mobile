import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeleteActionBar } from '@/components/ui/DeleteActionBar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SessionCard } from '@/components/ui/SessionCard';
import {
  formatDuration,
  formatSessionDate,
  getSessionTitle,
  getSessionType,
} from '@/lib/speechMetrics';
import {
  useDeleteSpeechAnalysis,
  useSpeechAnalysisList,
} from '@/hooks/useSpeechAnalyses';

import { DeleteConfirmModal } from './DeleteConfirmModal';
import { FilterChips } from './FilterChips';

type FilterValue = 'all' | 'prompt' | 'random';

export const AllSessions = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: sessions, isLoading } = useSpeechAnalysisList();
  const deleteAnalysis = useDeleteSpeechAnalysis();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filteredSessions = useMemo(() => {
    const allSessions = sessions ?? [];

    if (activeFilter === 'all') return allSessions;
    return allSessions.filter(
      (session) => getSessionType(session.prompt_id) === activeFilter
    );
  }, [activeFilter, sessions]);

  const handlePress = useCallback(
    (id: string) => {
      if (selectionMode) {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          if (next.size === 0) {
            setSelectionMode(false);
          }
          return next;
        });
      } else {
        router.push(`/results?id=${id}`);
      }
    },
    [selectionMode, router]
  );

  const handleLongPress = useCallback(
    (id: string) => {
      if (!selectionMode) {
        setSelectionMode(true);
        setSelectedIds(new Set([id]));
      }
    },
    [selectionMode]
  );

  const handleCloseSelection = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    selectedIds.forEach((id) => {
      deleteAnalysis.mutate(id);
    });
    setShowDeleteModal(false);
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, [deleteAnalysis, selectedIds]);

  return (
    <View className="flex-1 bg-white" testID="all-sessions.screen">
      <View className="gap-4 px-6" style={{ paddingTop: insets.top + 16 }}>
        <ScreenHeader testID="all-sessions" title="All sessions" />
        <FilterChips
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          selectionMode={selectionMode}
        />
      </View>

      {isLoading ? (
        <View className="items-center py-10">
          <ActivityIndicator />
        </View>
      ) : filteredSessions.length > 0 ? (
        <FlatList
          contentContainerClassName="px-6 pb-10 pt-4"
          contentContainerStyle={{
            paddingBottom: selectionMode ? 100 + insets.bottom : 40,
          }}
          data={filteredSessions}
          ItemSeparatorComponent={() => <View className="h-3" />}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SessionCard
              date={formatSessionDate(item.created_at)}
              duration={formatDuration(item.duration_seconds)}
              onLongPress={() => handleLongPress(item.id)}
              onPress={() => handlePress(item.id)}
              selected={selectedIds.has(item.id)}
              showCheckbox={selectionMode}
              testID={`all-sessions.session-${item.id}`}
              title={getSessionTitle(item.prompt_id)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text className="text-body-base px-6 py-8 text-center font-sf-rounded-medium text-grey-500">
          No sessions found
        </Text>
      )}

      {selectionMode && selectedIds.size > 0 ? (
        <DeleteActionBar
          onClose={handleCloseSelection}
          onDelete={() => setShowDeleteModal(true)}
          testID="all-sessions"
        />
      ) : null}

      <DeleteConfirmModal
        count={selectedIds.size}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        visible={showDeleteModal}
      />
    </View>
  );
};
