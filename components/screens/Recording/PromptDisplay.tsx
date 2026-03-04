import { BlurView } from 'expo-blur';
import { Text, View } from 'react-native';

interface PromptDisplayProps {
  testID?: string;
  text: string;
}

export const PromptDisplay = ({ testID, text }: PromptDisplayProps) => {
  return (
    <View
      className="h-[140px] overflow-hidden rounded-32"
      style={{ borderCurve: 'continuous' }}
      testID={testID}
    >
      <BlurView intensity={12} style={{ flex: 1 }} tint="light">
        <View className="bg-white/12 flex-1 items-center justify-center border border-white/40 px-6">
          <Text
            className="text-center font-sf-rounded-semibold text-h4 text-black"
            numberOfLines={3}
          >
            &ldquo;{text}&rdquo;
          </Text>
        </View>
      </BlurView>
    </View>
  );
};
