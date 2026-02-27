import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { Button } from "./Button";

type EmptyStateProps = {
  actionLabel?: string;
  icon?: ReactNode;
  onAction?: () => void;
  subtitle?: string;
  title: string;
};

export const EmptyState = ({
  actionLabel,
  icon,
  onAction,
  subtitle,
  title,
}: EmptyStateProps) => {
  return (
    <View className="items-center justify-center gap-4 px-6 py-12">
      {icon && <View className="mb-2">{icon}</View>}
      <Text className="text-center text-body-xl font-semibold text-black">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-center text-body-base text-grey-500">
          {subtitle}
        </Text>
      ) : null}
      {onAction && (
        <Button onPress={onAction}>{actionLabel ?? "Try Again"}</Button>
      )}
    </View>
  );
};
