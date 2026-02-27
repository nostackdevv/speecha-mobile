import { type ReactNode } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

import { Colors } from "@/constants/Colors";

type ButtonSize = "lg" | "md" | "sm";
type ButtonVariant = "destructive" | "ghost" | "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const sizeClasses: Record<ButtonSize, string> = {
  lg: "h-14 px-8",
  md: "h-12 px-6",
  sm: "h-10 px-4",
};

const variantClasses: Record<ButtonVariant, string> = {
  destructive: "bg-error active:bg-error/80",
  ghost: "active:bg-grey-100",
  primary: "bg-brand-blue active:bg-brand-blue-500",
  secondary: "border-2 border-brand-blue active:bg-brand-blue-0",
};

const textVariantClasses: Record<ButtonVariant, string> = {
  destructive: "text-white",
  ghost: "text-grey-700",
  primary: "text-white",
  secondary: "text-brand-blue",
};

const textSizeClasses: Record<ButtonSize, string> = {
  lg: "text-body-l",
  md: "text-body-base",
  sm: "text-body-s",
};

const indicatorColor: Record<ButtonVariant, string> = {
  destructive: Colors.white,
  ghost: Colors.grey[700],
  primary: Colors.white,
  secondary: Colors.brand.blue.DEFAULT,
};

export const Button = ({
  children,
  disabled = false,
  loading = false,
  onPress,
  size = "md",
  variant = "primary",
}: ButtonProps) => {
  return (
    // TODO: Add style={{ borderCurve: 'continuous' }} for smoother iOS corners
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      className={`items-center justify-center rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${disabled || loading ? "opacity-50" : ""}`}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor[variant]} />
      ) : typeof children === "string" ? (
        <Text
          className={`font-semibold ${textVariantClasses[variant]} ${textSizeClasses[size]}`}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
