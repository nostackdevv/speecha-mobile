import { BottomSheet } from '@/components/ui/BottomSheet';

interface TooShortSheetProps {
  onResume: () => void;
  testID?: string;
  visible: boolean;
}

export const TooShortSheet = ({
  onResume,
  testID,
  visible,
}: TooShortSheetProps) => {
  return (
    <BottomSheet
      actionLabel="Resume"
      description="Please try speaking for at least 10 seconds so Speecha can analyze your speech and give you meaningful feedback."
      icon="sadFace"
      onAction={onResume}
      testID={testID}
      title="Session is too short"
      visible={visible}
    />
  );
};
