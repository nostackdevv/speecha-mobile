import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeleteActionBar } from '@/components/ui/DeleteActionBar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SessionCard } from '@/components/ui/SessionCard';
import {
  formatDuration,
  formatSessionDate,
  MOCK_SESSIONS,
} from '@/constants/mockSessions';

import { DeleteConfirmModal } from './DeleteConfirmModal';
import { FilterChips } from './FilterChips';

type FilterValue = 'all' | 'prompt' | 'random';

export const AllSessions = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filteredSessions = useMemo(() => {
    if (activeFilter === 'all') return MOCK_SESSIONS;
    return MOCK_SESSIONS.filter((s) => s.type === activeFilter);
  }, [activeFilter]);

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
        router.push('/results');
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
    setShowDeleteModal(false);
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

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
            date={formatSessionDate(item.date)}
            duration={formatDuration(item.durationSeconds)}
            onLongPress={() => handleLongPress(item.id)}
            onPress={() => handlePress(item.id)}
            selected={selectedIds.has(item.id)}
            showCheckbox={selectionMode}
            testID={`all-sessions.session-${item.id}`}
            title={item.title}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

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
