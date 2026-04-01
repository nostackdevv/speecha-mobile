import { FriendshipStatus } from '@/types/friendship';

export const FRIENDSHIP_STATUS_CONFIG: Record<
  FriendshipStatus,
  { disabled: boolean; label: string }
> = {
  accepted: { disabled: true, label: 'Friends' },
  none: { disabled: false, label: 'Add' },
  pending_received: { disabled: true, label: 'Respond' },
  pending_sent: { disabled: true, label: 'Pending' },
};
