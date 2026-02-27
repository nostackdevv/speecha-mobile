import { Text, View } from "react-native";

type StatCardProps = {
  className?: string;
  label: string;
  value: string;
};

export const StatCard = ({ className, label, value }: StatCardProps) => {
  return (
    // TODO: Add style={{ borderCurve: 'continuous' }} for smoother iOS corners
    <View
      className={`items-center justify-center gap-1 rounded-[20px] bg-grey-100 p-4 ${className ?? ""}`}
    >
      <Text className="text-center text-heading-4 font-semibold text-black">
        {value}
      </Text>
      <Text className="text-center text-body-s font-medium uppercase text-grey-500">
        {label}
      </Text>
    </View>
  );
};
