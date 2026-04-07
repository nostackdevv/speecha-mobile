import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { Alert, Modal, Pressable, Share, Text, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';

interface InviteSheetProps {
  inviteLink: string;
  onClose: () => void;
  visible: boolean;
}

export const InviteSheet = ({
  inviteLink,
  onClose,
  visible,
}: InviteSheetProps) => {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(inviteLink);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied', 'Invite link copied to clipboard.');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on Speecha! ${inviteLink}`,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert('Share failed', 'Could not share the invite link right now.');
    }
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Pressable
        className="flex-1 items-center justify-center"
        onPress={onClose}
      >
        <BlurView className="absolute inset-0" intensity={20} tint="dark" />
        <Pressable
          className="mx-6 w-full max-w-[340px] rounded-40 bg-white px-6 pb-6 pt-6"
          onPress={(e) => e.stopPropagation()}
          style={{ borderCurve: 'continuous' }}
        >
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="font-sf-rounded-bold text-h4 text-black">
              Invite your friends
            </Text>
            <IconButton
              accessibilityLabel="Close"
              className="h-10 w-10 rounded-full"
              icon="close"
              onPress={onClose}
              variant="filled"
            />
          </View>
          <View
            className="items-center rounded-24 bg-grey-100 px-6 py-6"
            style={{ borderCurve: 'continuous' }}
          >
            <Text className="mb-2 font-sf-rounded-semibold text-body-sm uppercase tracking-wider text-clarity-blue">
              Your invite link
            </Text>
            <Text className="mb-4 text-center font-sf-rounded-medium text-body-lg text-grey-500">
              {inviteLink}
            </Text>
            <View className="flex-row gap-3">
              <IconButton
                accessibilityLabel="Copy invite link"
                className="h-12 w-12 rounded-full"
                icon="copy"
                onPress={handleCopy}
                testID="invite-sheet.copy-btn"
                variant="filled"
              />
              <IconButton
                accessibilityLabel="Share invite link"
                className="h-12 w-12 rounded-full"
                icon="share"
                onPress={handleShare}
                testID="invite-sheet.share-btn"
                variant="filled"
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
