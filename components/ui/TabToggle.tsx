import { Pressable, Text, View } from "react-native";

type TabToggleProps = {
  onValueChange: (value: string) => void;
  options: [string, string];
  value: string;
};

export const TabToggle = ({
  onValueChange,
  options,
  value,
}: TabToggleProps) => {
  return (
    // TODO: Add style={{ borderCurve: 'continuous' }} for smoother iOS corners
    <View className="flex-row rounded-full bg-grey-50 p-0.5">
      {options.map((option) => {
        const isActive = option === value;

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            className={`flex-1 items-center justify-center rounded-full py-3 ${
              isActive ? "bg-brand-blue" : ""
            }`}
            key={option}
            onPress={() => onValueChange(option)}
          >
            <Text
              className={`text-body-l font-medium ${
                isActive ? "text-white" : "text-grey-500"
              }`}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
