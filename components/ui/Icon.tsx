import { ICONS, type IconName } from '@/constants/icons';

interface IconProps {
  color?: string;
  name: IconName;
  size?: number;
}

export const Icon = ({ color, name, size = 20 }: IconProps) => {
  const SvgComponent = ICONS[name];
  return <SvgComponent color={color} height={size} width={size} />;
};
