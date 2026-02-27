import { type ReactNode } from "react";
import { Pressable } from "react-native";

type IconButtonSize = "lg" | "md" | "sm";
type IconButtonVariant = "default" | "primary";

type IconButtonProps = {
  accessibilityLabel: string;
  icon: ReactNode;
  onPress?: () => void;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
};

const sizeClasses: Record<IconButtonSize, string> = {
  lg: "size-16",
  md: "size-12",
  sm: "size-8",
};

const variantClasses: Record<IconButtonVariant, string> = {
  default: "bg-grey-100 active:opacity-70",
  primary: "bg-brand-blue active:opacity-70",
};

export const IconButton = ({
  accessibilityLabel,
  icon,
  onPress,
  size = "md",
  variant = "default",
}: IconButtonProps) => {
  return (
    // TODO: Add style={{ borderCurve: 'continuous' }} for smoother iOS corners
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className={`items-center justify-center rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}
      onPress={onPress}
    >
      {icon}
    </Pressable>
  );
};
