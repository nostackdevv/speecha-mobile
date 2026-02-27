export type Badge = {
  description: string;
  icon: string;
  id: string;
  name: string;
  unlockCriteria: BadgeUnlockCriteria;
};

export type BadgeUnlockCriteria = {
  threshold: number;
  type: "streak" | "sessions" | "clarity" | "filler_free" | "friends";
};

export type UserBadge = Badge & {
  unlockedAt: string | null;
  unlocked: boolean;
};
