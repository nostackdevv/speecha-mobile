export const PRO_BENEFITS = [
  "Unlimited recordings per day",
  "2 min max per recording",
  "Unlimited friends",
  "Cloud sync",
] as const;

export type PlanInterval = "year" | "month";

export type Plan = {
  badge: string | null;
  interval: PlanInterval;
  price: string;
};

export const PLANS: Record<string, Plan> = {
  annual: {
    badge: "Best value",
    interval: "year",
    price: "$28.99",
  },
  monthly: {
    badge: null,
    interval: "month",
    price: "$12.65",
  },
};
