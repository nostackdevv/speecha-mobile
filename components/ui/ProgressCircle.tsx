import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Colors } from "@/constants/Colors";

type ProgressCircleProps = {
  color?: string;
  label?: string;
  size?: number;
  strokeWidth?: number;
  value: number;
};

export const ProgressCircle = ({
  color = Colors.brand.blue.DEFAULT,
  label,
  size = 180,
  strokeWidth = 12,
  value,
}: ProgressCircleProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Svg height={size} width={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={Colors.grey[200]}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </Svg>
      <View className="absolute items-center justify-center">
        <Text className="text-center text-heading-3 font-bold text-black">
          {clampedValue}%
        </Text>
        {label ? (
          <Text className="text-center text-body-s font-medium uppercase text-grey-500">
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
