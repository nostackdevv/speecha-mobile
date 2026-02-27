import { GoalOption, OnboardingSlide } from "@/types/onboarding";

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    image: "",
    // image: require("@/assets/images/icon.png"),
    subtitle:
      "Speecha highlights your filler words and helps you get rid of them",
    title: "Eliminate filler words",
  },
  {
    id: "2",
    image: "",
    // image: require("@/assets/images/icon.png"),
    subtitle:
      "Record yourself speaking daily and watch your clarity improve over time",
    title: "Build a daily habit",
  },
  {
    id: "3",
    image: "",
    // image: require("@/assets/images/icon.png"),
    subtitle: "Track your progress, earn badges, and practice with friends",
    title: "Track your growth",
  },
];

export const GOAL_OPTIONS: GoalOption[] = [
  {
    description: "Land your dream role",
    icon: "briefcase",
    id: "interview",
    label: "Nail Preparation",
  },
  {
    description: "Connect naturally with anyone",
    icon: "message-circle",
    id: "social",
    label: "Social conversations",
  },
  {
    description: "Communicate clearly to any audience",
    icon: "mic",
    id: "public-speaking",
    label: "Public speaking",
  },
  {
    description: "Speak with ease anywhere",
    icon: "sparkles",
    id: "confidence",
    label: "Speak with confidence",
  },
];
