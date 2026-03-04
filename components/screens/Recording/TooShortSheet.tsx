import { BottomSheet } from '@/components/ui/BottomSheet';
import { MIN_RECORDING_DURATION_SECONDS } from '@/constants/limits';

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
      description={`Please try speaking for at least ${MIN_RECORDING_DURATION_SECONDS} seconds so Speecha can analyze your speech and give you meaningful feedback.`}
      icon="sadFace"
      onAction={onResume}
      testID={testID}
      title="Session is too short"
      visible={visible}
    />
  );
};
