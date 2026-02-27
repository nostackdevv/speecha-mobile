import { View } from "react-native";

type DividerProps = {
  className?: string;
};

export const Divider = ({ className }: DividerProps) => {
  return <View className={`h-px w-full bg-grey-200 ${className ?? ""}`} />;
};
