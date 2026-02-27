import { Image } from "expo-image";
import { useState } from "react";
import { Text, View } from "react-native";

type AvatarSize = "lg" | "md" | "sm" | "xl";

type AvatarProps = {
  fallback?: string;
  size?: AvatarSize;
  source?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  lg: "size-16",
  md: "size-12",
  sm: "size-8",
  xl: "size-24",
};

const sizeValues: Record<AvatarSize, number> = {
  lg: 64,
  md: 48,
  sm: 32,
  xl: 96,
};

const textSizeClasses: Record<AvatarSize, string> = {
  lg: "text-body-xl",
  md: "text-body-base",
  sm: "text-body-xs",
  xl: "text-heading-4",
};

const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const Avatar = ({ fallback, size = "md", source }: AvatarProps) => {
  const [hasError, setHasError] = useState(false);
  const showFallback = !source || hasError;

  if (showFallback) {
    return (
      // TODO: Add style={{ borderCurve: 'continuous' }} for smoother iOS corners
      <View
        className={`items-center justify-center rounded-full bg-grey-200 ${sizeClasses[size]}`}
      >
        {fallback ? (
          <Text
            className={`font-semibold text-grey-600 ${textSizeClasses[size]}`}
          >
            {getInitials(fallback)}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <Image
      className={`rounded-full ${sizeClasses[size]}`}
      contentFit="cover"
      onError={() => setHasError(true)}
      source={source}
      style={{ width: sizeValues[size], height: sizeValues[size] }}
    />
  );
};
