import { BottomSheet } from '@/components/ui/BottomSheet';

interface PermissionDeniedSheetProps {
  onDismiss: () => void;
  visible: boolean;
}

export const PermissionDeniedSheet = ({
  onDismiss,
  visible,
}: PermissionDeniedSheetProps) => {
  return (
    <BottomSheet
      actionLabel="Dismiss"
      description="Speecha needs access to your microphone to record your speech. Please enable it in your device settings."
      icon="mic"
      onAction={onDismiss}
      title="Microphone access required"
      visible={visible}
    />
  );
};
