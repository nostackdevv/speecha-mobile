import { BottomSheet } from '@/components/ui/BottomSheet';

interface PermissionDeniedSheetProps {
  onDismiss: () => void;
  testID?: string;
  visible: boolean;
}

export const PermissionDeniedSheet = ({
  onDismiss,
  testID,
  visible,
}: PermissionDeniedSheetProps) => {
  return (
    <BottomSheet
      actionLabel="Dismiss"
      description="Speecha needs access to your microphone to record your speech. Please enable it in your device settings."
      icon="mic"
      onAction={onDismiss}
      testID={testID}
      title="Microphone access required"
      visible={visible}
    />
  );
};
