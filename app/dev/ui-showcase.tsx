import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { StatCard } from '@/components/ui/StatCard';

const SectionTitle = ({ title }: { title: string }) => (
  <Text className="mb-3 mt-8 font-sf-rounded-semibold text-body-xs uppercase tracking-wider text-grey-400">
    {title}
  </Text>
);

export default function UIShowcaseScreen() {
  const [segment2, setSegment2] = useState('Weekly');
  const [segment3, setSegment3] = useState('All');

  return (
    <ScrollView className="flex-1 bg-bg px-6 pb-20 pt-[62px]">
      <Text className="font-sf-rounded-bold text-h3 text-black">
        UI Components
      </Text>
      <Text className="mt-1 font-sf-rounded text-body-sm text-grey-500">
        Speecha design system showcase
      </Text>

      {/* Button */}
      <SectionTitle title="Button" />
      <View className="gap-3">
        <Button onPress={() => {}} title="Start Recording" />
        <Button onPress={() => {}} title="Secondary" variant="secondary" />
        <Button icon="mic" onPress={() => {}} title="With Icon" />
        <Button fullWidth onPress={() => {}} title="Full Width" />
        <Button disabled onPress={() => {}} title="Disabled" />
      </View>

      {/* IconButton */}
      <SectionTitle title="IconButton" />
      <View className="flex-row gap-3">
        <IconButton
          accessibilityLabel="Back"
          className="h-12 w-12 rounded-full"
          icon="chevronLeft"
          onPress={() => {}}
        />
        <IconButton
          accessibilityLabel="Close"
          className="h-12 w-12 rounded-full"
          icon="close"
          onPress={() => {}}
          variant="ghost"
        />
        <IconButton
          accessibilityLabel="Upload"
          className="h-12 w-12 rounded-full"
          icon="arrowUp"
          onPress={() => {}}
          variant="dark"
        />
        <IconButton
          accessibilityLabel="Settings"
          className="h-12 w-12 rounded-full"
          icon="settings"
          onPress={() => {}}
        />
        <IconButton
          accessibilityLabel="Delete"
          className="h-12 w-12 rounded-full"
          disabled
          icon="trash"
          onPress={() => {}}
        />
      </View>
      <View className="mt-3 flex-row gap-3">
        <IconButton
          accessibilityLabel="Record"
          className="h-16 w-32 rounded-32"
          icon="mic"
          iconSize={22}
          onPress={() => {}}
          variant="primary"
        />
        <IconButton
          accessibilityLabel="Confirm"
          className="h-16 w-32 rounded-32"
          icon="checkmark"
          iconSize={22}
          onPress={() => {}}
          variant="light"
        />
      </View>

      {/* Card */}
      <SectionTitle title="Card" />
      <Card>
        <Text className="font-sf-rounded-semibold text-body-lg text-black">
          Sample Card
        </Text>
        <Text className="mt-2 font-sf-rounded text-body-sm text-grey-500">
          Cards are generic containers for grouping content.
        </Text>
      </Card>

      {/* StatCard */}
      <SectionTitle title="StatCard" />
      <View className="flex-row gap-3">
        <StatCard className="flex-1" label="Clarity" value="92%" />
        <StatCard className="flex-1" label="Fillers" value="4" />
      </View>

      {/* Avatar */}
      <SectionTitle title="Avatar" />
      <View className="flex-row items-end gap-4">
        <Avatar size="sm" />
        <Avatar size="md" />
        <Avatar size="lg" />
        <Avatar ringColor="#00a7ef" size="md" />
        <Avatar showOnlineIndicator size="md" />
      </View>

      {/* Badge */}
      <SectionTitle title="Badge" />
      <View className="flex-row gap-6">
        <Badge label="First Steps" rank="bronze" />
        <Badge label="Consistent" rank="silver" />
        <Badge label="Master" rank="gold" />
      </View>

      {/* SegmentedControl */}
      <SectionTitle title="SegmentedControl" />
      <View className="gap-3">
        <SegmentedControl
          onValueChange={setSegment2}
          segments={['Weekly', 'Monthly']}
          selectedValue={segment2}
        />
        <SegmentedControl
          onValueChange={setSegment3}
          segments={['All', 'Week', 'Month']}
          selectedValue={segment3}
        />
      </View>

      {/* ProgressBar */}
      <SectionTitle title="ProgressBar" />
      <View className="gap-3">
        <ProgressBar progress={0.25} />
        <ProgressBar progress={0.5} />
        <ProgressBar progress={0.75} />
        <ProgressBar color="#ff5e07" progress={1} />
      </View>

      {/* SectionHeader */}
      <SectionTitle title="SectionHeader" />
      <View className="gap-4">
        <SectionHeader title="Recent Sessions" />
        <SectionHeader title="Friends" trailing="12 total" />
        <SectionHeader
          onTrailingPress={() => {}}
          title="Badges"
          trailing="See All"
          trailingIsAction
        />
      </View>

      {/* Chip */}
      <SectionTitle title="Chip" />
      <View className="flex-row gap-2">
        <Chip label="Default" />
        <Chip label="Accent" variant="accent" />
        <Chip label="Success" variant="success" />
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
