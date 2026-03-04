import type { IconName } from '@/constants/icons';

type Archetype = {
  icon: IconName;
  title: string;
};

// TODO: Change archetypes trophy icons and labels
const ARCHETYPES: Archetype[] = [
  { title: 'The Eloquent Communicator', icon: 'trophy' },
  { title: 'The Brave Beginner', icon: 'trophy' },
];

export const getArchetype = (score: number): Archetype =>
  score >= 50 ? ARCHETYPES[0] : ARCHETYPES[1];
