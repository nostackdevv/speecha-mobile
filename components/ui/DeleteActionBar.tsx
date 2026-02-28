import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';

import { Icon } from './Icon';

interface DeleteActionBarProps {
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteActionBar = ({
  onClose,
  onDelete,
}: DeleteActionBarProps) => {
  const insets = useSafeAreaInsets();

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <View className="absolute bottom-0 w-full px-2" style={{ paddingTop: 8 }}>
      <View
        className="flex-row rounded-40 border border-white p-1"
        style={{
          backgroundColor: 'rgba(255,255,255,0.72)',
          borderCurve: 'continuous',
          gap: 12,
        }}
      >
        <Pressable
          className="flex-1 flex-row items-center justify-center rounded-32 bg-error-500 p-3"
          onPress={handleDelete}
          style={({ pressed }) => ({
            borderCurve: 'continuous',
            gap: 8,
            height: 56,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Icon color={COLORS.white} name="trash" size={24} />
          <Text className="font-sf-rounded-medium text-body-lg text-white">
            Delete
          </Text>
        </Pressable>

        <Pressable
          className="items-center justify-center rounded-32 bg-grey-400"
          onPress={handleClose}
          style={({ pressed }) => ({
            borderCurve: 'continuous',
            height: 56,
            opacity: pressed ? 0.8 : 1,
            width: 56,
          })}
        >
          <Icon color={COLORS.white} name="close" size={24} />
        </Pressable>
      </View>

      <View style={{ height: insets.bottom }} />
    </View>
  );
};
