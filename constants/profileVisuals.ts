import type { ComponentType } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import Badge01Bronze from '@/assets/images/figma/badges/badge-01-bronze.svg';
import Badge02Gold from '@/assets/images/figma/badges/badge-02-gold.svg';
import Badge03Speaker from '@/assets/images/figma/badges/badge-03-speaker.svg';
import Badge04Variant from '@/assets/images/figma/badges/badge-04-variant.svg';
import Badge05Variant from '@/assets/images/figma/badges/badge-05-variant.svg';
import Badge06Variant from '@/assets/images/figma/badges/badge-06-variant.svg';
import Badge07Variant from '@/assets/images/figma/badges/badge-07-variant.svg';
import Badge08Variant from '@/assets/images/figma/badges/badge-08-variant.svg';
import Badge09Variant from '@/assets/images/figma/badges/badge-09-variant.svg';
import Badge10Variant from '@/assets/images/figma/badges/badge-10-variant.svg';
import Badge11Variant from '@/assets/images/figma/badges/badge-11-variant.svg';
import Badge12Variant from '@/assets/images/figma/badges/badge-12-variant.svg';
import Avatar01 from '@/assets/images/figma/profile/avatars/avatar-01.png';
import Avatar02 from '@/assets/images/figma/profile/avatars/avatar-02.png';
import Avatar03 from '@/assets/images/figma/profile/avatars/avatar-03.png';
import Avatar04 from '@/assets/images/figma/profile/avatars/avatar-04.png';
import Avatar05 from '@/assets/images/figma/profile/avatars/avatar-05.png';
import Avatar06 from '@/assets/images/figma/profile/avatars/avatar-06.png';
import Avatar07 from '@/assets/images/figma/profile/avatars/avatar-07.png';
import Avatar08 from '@/assets/images/figma/profile/avatars/avatar-08.png';
import Avatar09 from '@/assets/images/figma/profile/avatars/avatar-09.png';
import Avatar10 from '@/assets/images/figma/profile/avatars/avatar-10.png';
import Avatar11 from '@/assets/images/figma/profile/avatars/avatar-11.png';
import Avatar12 from '@/assets/images/figma/profile/avatars/avatar-12.png';
import Avatar13 from '@/assets/images/figma/profile/avatars/avatar-13.png';
import Avatar14 from '@/assets/images/figma/profile/avatars/avatar-14.png';
import Avatar15 from '@/assets/images/figma/profile/avatars/avatar-15.png';
import Avatar16 from '@/assets/images/figma/profile/avatars/avatar-16.png';
import Avatar17 from '@/assets/images/figma/profile/avatars/avatar-17.png';
import Avatar18 from '@/assets/images/figma/profile/avatars/avatar-18.png';
import Avatar19 from '@/assets/images/figma/profile/avatars/avatar-19.png';
import Avatar20 from '@/assets/images/figma/profile/avatars/avatar-20.png';
import Avatar21 from '@/assets/images/figma/profile/avatars/avatar-21.png';
import Avatar22 from '@/assets/images/figma/profile/avatars/avatar-22.png';
import Avatar23 from '@/assets/images/figma/profile/avatars/avatar-23.png';
import Avatar24 from '@/assets/images/figma/profile/avatars/avatar-24.png';

export type ProfileAvatar = {
  key: string;
  source: ImageSourcePropType;
};

export type ProfileBadge = {
  Icon: ComponentType<SvgProps>;
  key: string;
  label: string;
  size: number;
};

export const PROFILE_AVATARS: ProfileAvatar[] = [
  { key: 'avatar-01', source: Avatar01 },
  { key: 'avatar-02', source: Avatar02 },
  { key: 'avatar-03', source: Avatar03 },
  { key: 'avatar-04', source: Avatar04 },
  { key: 'avatar-05', source: Avatar05 },
  { key: 'avatar-06', source: Avatar06 },
  { key: 'avatar-07', source: Avatar07 },
  { key: 'avatar-08', source: Avatar08 },
  { key: 'avatar-09', source: Avatar09 },
  { key: 'avatar-10', source: Avatar10 },
  { key: 'avatar-11', source: Avatar11 },
  { key: 'avatar-12', source: Avatar12 },
  { key: 'avatar-13', source: Avatar13 },
  { key: 'avatar-14', source: Avatar14 },
  { key: 'avatar-15', source: Avatar15 },
  { key: 'avatar-16', source: Avatar16 },
  { key: 'avatar-17', source: Avatar17 },
  { key: 'avatar-18', source: Avatar18 },
  { key: 'avatar-19', source: Avatar19 },
  { key: 'avatar-20', source: Avatar20 },
  { key: 'avatar-21', source: Avatar21 },
  { key: 'avatar-22', source: Avatar22 },
  { key: 'avatar-23', source: Avatar23 },
  { key: 'avatar-24', source: Avatar24 },
];

export type ProfileAvatarKey = (typeof PROFILE_AVATARS)[number]['key'];

export const DEFAULT_PROFILE_AVATAR_KEY: ProfileAvatarKey = 'avatar-01';

export const PROFILE_BADGES: ProfileBadge[] = [
  {
    Icon: Badge01Bronze,
    key: 'badge-01',
    label: '7-DAY STREAK',
    size: 56,
  },
  {
    Icon: Badge02Gold,
    key: 'badge-02',
    label: 'FILLER FREE',
    size: 58,
  },
  {
    Icon: Badge03Speaker,
    key: 'badge-03',
    label: 'PUBLIC SPEAKER',
    size: 64,
  },
  {
    Icon: Badge04Variant,
    key: 'badge-04',
    label: 'PUBLIC SPEAKER',
    size: 64,
  },
  {
    Icon: Badge05Variant,
    key: 'badge-05',
    label: 'PUBLIC SPEAKER',
    size: 64,
  },
  {
    Icon: Badge06Variant,
    key: 'badge-06',
    label: 'PUBLIC SPEAKER',
    size: 64,
  },
  {
    Icon: Badge07Variant,
    key: 'badge-07',
    label: 'PUBLIC SPEAKER',
    size: 64,
  },
  {
    Icon: Badge08Variant,
    key: 'badge-08',
    label: 'PUBLIC SPEAKER',
    size: 64,
  },
  {
    Icon: Badge09Variant,
    key: 'badge-09',
    label: 'PUBLIC SPEAKER',
    size: 64,
  },
  {
    Icon: Badge10Variant,
    key: 'badge-10',
    label: 'PUBLIC SPEAKER',
    size: 64,
  },
  {
    Icon: Badge11Variant,
    key: 'badge-11',
    label: 'PUBLIC SPEAKER',
    size: 64,
  },
  {
    Icon: Badge12Variant,
    key: 'badge-12',
    label: 'PUBLIC SPEAKER',
    size: 64,
  },
];

export const PROFILE_AVATAR_MAP: Record<ProfileAvatarKey, ImageSourcePropType> =
  PROFILE_AVATARS.reduce(
    (acc, avatar) => ({ ...acc, [avatar.key]: avatar.source }),
    {} as Record<ProfileAvatarKey, ImageSourcePropType>
  );
