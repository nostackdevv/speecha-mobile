import { BlurView } from 'expo-blur';
import { Modal, Pressable, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

import type { IconName } from '@/constants/icons';

import { Button } from './Button';
import { Icon } from './Icon';

interface BottomSheetProps {
  actionLabel: string;
  description: string;
  icon: IconName;
  iconSize?: number;
  onAction: () => void;
  title: string;
  visible: boolean;
}

export const BottomSheet = ({
  actionLabel,
  description,
  icon,
  iconSize = 70,
  onAction,
  title,
  visible,
}: BottomSheetProps) => {
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
            className="flex-1 justify-end"
            onPress={onAction}
            style={{ backgroundColor: 'rgba(4,25,37,0.5)' }}
          >
            <Pressable
              className="rounded-t-40 bg-white px-6 pb-6 pt-10"
              onPress={(e) => e.stopPropagation()}
              style={{ borderCurve: 'continuous' }}
            >
              <View className="items-center gap-8">
                <View className="size-[88px] items-center justify-center">
                  <Icon
                    color={COLORS.clarityBlue.DEFAULT}
                    name={icon}
                    size={iconSize}
                  />
                </View>

                <View className="items-center gap-3.5">
                  <Text className="font-sf-rounded-semibold text-h4 text-black">
                    {title}
                  </Text>

                  <Text className="text-center font-sf-rounded text-body-lg text-grey-500">
                    {description}
                  </Text>
                </View>

                <Button
                  className="h-[60px] w-full"
                  onPress={onAction}
                  title={actionLabel}
                />
              </View>
            </Pressable>
          </Pressable>
        </BlurView>
      </View>
    </Modal>
  );
};
