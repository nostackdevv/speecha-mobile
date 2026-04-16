import { type ImageSourcePropType, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';

interface HomeHeaderProps {
  avatarSource?: ImageSourcePropType;
  date: string;
  name: string;
  onAvatarPress: () => void;
}

export const HomeHeader = ({
  avatarSource,
  date,
  name,
  onAvatarPress,
}: HomeHeaderProps) => (
  <View className="flex-row items-center justify-between">
    <View>
      <Text className="font-sf-rounded-semibold text-body-xl text-black">
        Welcome back, {name} 👋
      </Text>
      <Text className="font-sf-rounded-medium text-body-sm text-grey-500">
        {date}
      </Text>
    </View>
    <Avatar
      imageSource={avatarSource}
      onPress={onAvatarPress}
      size="md"
      testID="home.avatar"
    />
  </View>
);
