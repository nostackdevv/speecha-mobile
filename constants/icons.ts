import ArrowUp from '@/assets/icons/arrow-up.svg';
import Bulb from '@/assets/icons/bulb.svg';
import Chart from '@/assets/icons/chart.svg';
import ChevronLeft from '@/assets/icons/chevron-left.svg';
import Close from '@/assets/icons/close.svg';
import Crown from '@/assets/icons/crown.svg';
import Edit from '@/assets/icons/edit.svg';
import Fire from '@/assets/icons/fire.svg';
import Home from '@/assets/icons/home.svg';
import Medal from '@/assets/icons/medal.svg';
import Mic from '@/assets/icons/mic.svg';
import Prompt from '@/assets/icons/prompt.svg';
import Question from '@/assets/icons/question.svg';
import RotateBack from '@/assets/icons/rotate-back.svg';
import Settings from '@/assets/icons/settings.svg';
import Trash from '@/assets/icons/trash.svg';
import Trophy from '@/assets/icons/trophy.svg';
import UserProfile from '@/assets/icons/user-profile.svg';
import Users from '@/assets/icons/users.svg';

export const ICONS = {
  'arrow-up': ArrowUp,
  bulb: Bulb,
  chart: Chart,
  'chevron-left': ChevronLeft,
  close: Close,
  crown: Crown,
  edit: Edit,
  fire: Fire,
  home: Home,
  medal: Medal,
  mic: Mic,
  prompt: Prompt,
  question: Question,
  'rotate-back': RotateBack,
  settings: Settings,
  trash: Trash,
  trophy: Trophy,
  'user-profile': UserProfile,
  users: Users,
} as const;

export type IconName = keyof typeof ICONS;
