import { BlurView } from 'expo-blur';
import { Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';

interface DeleteConfirmModalProps {
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
  visible: boolean;
}

export const DeleteConfirmModal = ({
  count,
  onCancel,
  onConfirm,
  visible,
}: DeleteConfirmModalProps) => {
  return (
    <Modal
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <View className="flex-1">
        <BlurView intensity={16} style={{ flex: 1 }} tint="dark">
          <Pressable
            className="flex-1 items-center justify-center px-10"
            onPress={onCancel}
            style={{ backgroundColor: 'rgba(4,25,37,0.5)' }}
          >
            <Pressable
              className="w-full rounded-[24px] bg-white px-6 pb-6 pt-8"
              onPress={(e) => e.stopPropagation()}
              style={{ borderCurve: 'continuous' }}
            >
              <View className="items-center gap-6">
                <Icon color={COLORS.error[500]} name="trash" size={48} />

                <View className="items-center gap-3">
                  <Text className="font-sf-rounded-semibold text-h4 text-black">
                    Delete {count} recording?
                  </Text>
                  <Text className="text-center font-sf-rounded text-body-lg text-grey-500">
                    You&apos;re about to delete {count} recordings from your
                    history. They can&apos;t be recovered once removed.
                  </Text>
                </View>

                <View className="w-full flex-row gap-3">
                  <Button
                    className="flex-1"
                    onPress={onCancel}
                    title="Cancel"
                    variant="secondary"
                  />
                  <Button
                    className="flex-1"
                    onPress={onConfirm}
                    title="Delete"
                    variant="destructive"
                  />
                </View>
              </View>
            </Pressable>
          </Pressable>
        </BlurView>
      </View>
    </Modal>
  );
};
