import { Image } from 'expo-image';

interface IconProps {
  color?: string;
  name: string;
  size?: number;
}

export const Icon = ({ color, name, size = 20 }: IconProps) => (
  <Image
    contentFit="contain"
    source={{ uri: `sf:${name}` }}
    style={{ height: size, width: size }}
    tintColor={color}
  />
);
