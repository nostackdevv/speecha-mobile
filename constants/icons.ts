import AddFriend from '@/assets/icons/add-friend.svg';
import ArrowLeft from '@/assets/icons/arrow-left.svg';
import ArrowUp from '@/assets/icons/arrow-up.svg';
import ArrowUpRight from '@/assets/icons/arrow-up-right.svg';
import Bolt from '@/assets/icons/bolt.svg';
import Bulb from '@/assets/icons/bulb.svg';
import Chart from '@/assets/icons/chart.svg';
import Check from '@/assets/icons/check.svg';
import Checkmark from '@/assets/icons/checkmark.svg';
import ChevronLeft from '@/assets/icons/chevron-left.svg';
import Close from '@/assets/icons/close.svg';
import Copy from '@/assets/icons/copy.svg';
import Crown from '@/assets/icons/crown.svg';
import Edit from '@/assets/icons/edit.svg';
import Fire from '@/assets/icons/fire.svg';
import Forward from '@/assets/icons/forward.svg';
import Home from '@/assets/icons/home.svg';
import Loader from '@/assets/icons/loader.svg';
import Medal from '@/assets/icons/medal.svg';
import Mic from '@/assets/icons/mic.svg';
import Pause from '@/assets/icons/pause.svg';
import Play from '@/assets/icons/play.svg';
import Prompt from '@/assets/icons/prompt.svg';
import Question from '@/assets/icons/question.svg';
import RotateBack from '@/assets/icons/rotate-back.svg';
import RotateForward from '@/assets/icons/rotate-forward.svg';
import SadFace from '@/assets/icons/sad-face.svg';
import Settings from '@/assets/icons/settings.svg';
import Share from '@/assets/icons/share.svg';
import Smiley from '@/assets/icons/smiley.svg';
import Trash from '@/assets/icons/trash.svg';
import Trophy from '@/assets/icons/trophy.svg';
import UserProfile from '@/assets/icons/user-profile.svg';
import Users from '@/assets/icons/users.svg';

export const ICONS = {
  addFriend: AddFriend,
  arrowLeft: ArrowLeft,
  arrowUp: ArrowUp,
  arrowUpRight: ArrowUpRight,
  bolt: Bolt,
  bulb: Bulb,
  chart: Chart,
  check: Check,
  checkmark: Checkmark,
  chevronLeft: ChevronLeft,
  close: Close,
  copy: Copy,
  crown: Crown,
  edit: Edit,
  fire: Fire,
  forward: Forward,
  home: Home,
  loader: Loader,
  medal: Medal,
  mic: Mic,
  pause: Pause,
  play: Play,
  prompt: Prompt,
  question: Question,
  rotateBack: RotateBack,
  rotateForward: RotateForward,
  sadFace: SadFace,
  settings: Settings,
  share: Share,
  smiley: Smiley,
  trash: Trash,
  trophy: Trophy,
  userProfile: UserProfile,
  users: Users,
} as const;

export type IconName = keyof typeof ICONS;
