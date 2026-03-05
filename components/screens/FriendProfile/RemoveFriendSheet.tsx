import { Modal, Pressable, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';

interface RemoveFriendSheetProps {
  name: string;
  onClose: () => void;
  onConfirm: () => void;
  visible: boolean;
}

export const RemoveFriendSheet = ({
  name,
  onClose,
  onConfirm,
  visible,
}: RemoveFriendSheetProps) => (
  <Modal
    animationType="fade"
    onRequestClose={onClose}
    transparent
    visible={visible}
  >
    <Pressable className="flex-1 items-center justify-center" onPress={onClose}>
      <BlurView className="absolute inset-0" intensity={20} tint="dark" />
      <Pressable
        className="mx-6 w-full max-w-[340px] items-center rounded-40 bg-white px-6 pb-6 pt-10"
        onPress={(e) => e.stopPropagation()}
        style={{ borderCurve: 'continuous' }}
      >
        <View className="mb-4 h-[88px] w-[88px] items-center justify-center rounded-full bg-error-50">
          <Icon color={COLORS.error[500]} name="sadFace" size={48} />
        </View>
        <Text className="mb-2 text-center font-sf-rounded-semibold text-h4 text-black">
          Remove {name} from your friends?
        </Text>
        <Text className="mb-8 text-center font-sf-rounded-medium text-body-xl text-grey-500">
          You won&apos;t be able to compete in weekly challenges together
          anymore.
        </Text>
        <View className="w-full gap-3">
          <Button
            fullWidth
            onPress={onConfirm}
            testID="remove-sheet.confirm-btn"
            title="Yes, Remove"
            variant="destructive"
          />
          <Button
            fullWidth
            onPress={onClose}
            testID="remove-sheet.cancel-btn"
            title="Keep friend"
            variant="secondary"
          />
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);
