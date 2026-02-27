import { View } from "react-native";

import { Colors } from "@/constants/Colors";

type ProgressBarProps = {
  color?: string;
  maxValue: number;
  value: number;
};

export const ProgressBar = ({ color, maxValue, value }: ProgressBarProps) => {
  const percentage = maxValue > 0 ? Math.min(value / maxValue, 1) * 100 : 0;

  return (
    // TODO: Add style={{ borderCurve: 'continuous' }} for smoother iOS corners
    <View className="h-2 w-full overflow-hidden rounded-full bg-grey-200">
      <View
        className="h-2 rounded-full"
        style={{
          backgroundColor: color ?? Colors.brand.blue.DEFAULT,
          width: `${percentage}%`,
        }}
      />
    </View>
  );
};
