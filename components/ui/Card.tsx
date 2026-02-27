import { type ReactNode } from "react";
import { View } from "react-native";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps) => {
  return (
    // TODO: Add style={{ borderCurve: 'continuous' }} for smoother iOS corners
    <View
      className={`overflow-hidden rounded-2xl bg-white p-4 shadow-sm ${className ?? ""}`}
    >
      {children}
    </View>
  );
};
