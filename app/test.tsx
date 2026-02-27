import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Avatar,
  Button,
  Card,
  Divider,
  EmptyState,
  IconButton,
  Modal,
  ProgressBar,
  ProgressCircle,
  SearchInput,
  StatCard,
  TabToggle,
  WeekProgress,
} from "@/components/ui";

const Section = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <View className="gap-3">
    <Text className="text-body-l font-semibold text-black">{title}</Text>
    {children}
  </View>
);

export const TestScreen = () => {
  const [tab, setTab] = useState("Friends");
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="gap-6 p-6 pb-12">
        <Text className="text-heading-3 font-bold text-black">
          Component Showcase
        </Text>

        {/* Button */}
        <Section title="Button">
          <View className="gap-3">
            <Text className="text-body-s text-grey-500">Variants</Text>
            <View className="flex-row flex-wrap gap-3">
              <Button onPress={() => Alert.alert("Primary")}>Primary</Button>
              <Button onPress={() => Alert.alert("Secondary")} variant="secondary">
                Secondary
              </Button>
              <Button onPress={() => Alert.alert("Destructive")} variant="destructive">
                Delete
              </Button>
              <Button onPress={() => Alert.alert("Ghost")} variant="ghost">
                Ghost
              </Button>
            </View>
            <Text className="text-body-s text-grey-500">Sizes</Text>
            <View className="flex-row flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </View>
            <Text className="text-body-s text-grey-500">States</Text>
            <View className="flex-row flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
              <Button loading variant="secondary">
                Loading
              </Button>
            </View>
          </View>
        </Section>

        <Divider />

        {/* IconButton */}
        <Section title="IconButton">
          <View className="flex-row flex-wrap items-center gap-3">
            <IconButton
              accessibilityLabel="Go back"
              icon={<Ionicons color="#414651" name="arrow-back" size={20} />}
              onPress={() => Alert.alert("Back")}
              size="sm"
            />
            <IconButton
              accessibilityLabel="Go back"
              icon={<Ionicons color="#414651" name="arrow-back" size={24} />}
              onPress={() => Alert.alert("Back")}
            />
            <IconButton
              accessibilityLabel="Settings"
              icon={<Ionicons color="#414651" name="settings-outline" size={24} />}
              onPress={() => Alert.alert("Settings")}
            />
            <IconButton
              accessibilityLabel="Play"
              icon={<Ionicons color="#ffffff" name="play" size={28} />}
              onPress={() => Alert.alert("Play")}
              size="lg"
              variant="primary"
            />
          </View>
        </Section>

        <Divider />

        {/* Card */}
        <Section title="Card">
          <Card>
            <Text className="text-body-base text-black">
              Default card with white background and shadow.
            </Text>
          </Card>
          <Card className="bg-grey-50">
            <Text className="text-body-base text-black">
              Card with className override (bg-grey-50).
            </Text>
          </Card>
        </Section>

        <Divider />

        {/* Avatar */}
        <Section title="Avatar">
          <View className="flex-row items-center gap-4">
            <Avatar fallback="Samuel Weke" size="sm" />
            <Avatar fallback="Samuel Weke" size="md" />
            <Avatar fallback="Samuel Weke" size="lg" />
            <Avatar fallback="Samuel Weke" size="xl" />
          </View>
          <Text className="text-body-xs text-grey-500">
            Fallback initials shown when no source image
          </Text>
        </Section>

        <Divider />

        {/* StatCard */}
        <Section title="StatCard">
          <View className="flex-row gap-3">
            <StatCard className="flex-1" label="Total Words" value="124K" />
            <StatCard className="flex-1" label="Avg Clarity" value="92%" />
          </View>
          <StatCard label="Common Filler" value="Like" />
        </Section>

        <Divider />

        {/* ProgressCircle */}
        <Section title="ProgressCircle">
          <View className="items-center">
            <ProgressCircle label="Clarity Score" value={80} />
          </View>
          <View className="flex-row items-center justify-center gap-6">
            <ProgressCircle
              color="#12b76a"
              label="Good"
              size={100}
              strokeWidth={8}
              value={92}
            />
            <ProgressCircle
              color="#f04438"
              label="Needs Work"
              size={100}
              strokeWidth={8}
              value={35}
            />
          </View>
        </Section>

        <Divider />

        {/* ProgressBar */}
        <Section title="ProgressBar">
          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <Text className="w-12 text-body-s text-grey-600">Um</Text>
              <View className="flex-1">
                <ProgressBar maxValue={10} value={6} />
              </View>
              <Text className="w-6 text-right text-body-s text-grey-600">
                x6
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="w-12 text-body-s text-grey-600">Like</Text>
              <View className="flex-1">
                <ProgressBar maxValue={10} value={4} />
              </View>
              <Text className="w-6 text-right text-body-s text-grey-600">
                x4
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="w-12 text-body-s text-grey-600">Uh</Text>
              <View className="flex-1">
                <ProgressBar color="#ff5e07" maxValue={10} value={2} />
              </View>
              <Text className="w-6 text-right text-body-s text-grey-600">
                x2
              </Text>
            </View>
          </View>
        </Section>

        <Divider />

        {/* TabToggle */}
        <Section title="TabToggle">
          <TabToggle
            onValueChange={setTab}
            options={["Friends", "Requests"]}
            value={tab}
          />
          <Text className="text-body-s text-grey-500">
            Selected: {tab}
          </Text>
        </Section>

        <Divider />

        {/* SearchInput */}
        <Section title="SearchInput">
          <SearchInput
            onChangeText={setSearch}
            placeholder="Search friends..."
            value={search}
          />
        </Section>

        <Divider />

        {/* WeekProgress */}
        <Section title="WeekProgress">
          <Card>
            <WeekProgress
              completedDays={[true, true, true, false, false, false, false]}
            />
          </Card>
        </Section>

        <Divider />

        {/* EmptyState */}
        <Section title="EmptyState">
          <EmptyState
            actionLabel="Add Friends"
            icon={<Ionicons color="#a4a7ae" name="people-outline" size={48} />}
            onAction={() => Alert.alert("Add Friends")}
            subtitle="Search for friends to see their progress"
            title="No friends yet"
          />
        </Section>

        <Divider />

        {/* Modal */}
        <Section title="Modal">
          <Button onPress={() => setModalVisible(true)}>Open Modal</Button>
          <Modal onClose={() => setModalVisible(false)} visible={modalVisible}>
            <View className="gap-4">
              <Text className="text-body-xl font-semibold text-black">
                Sample Modal
              </Text>
              <Text className="text-body-base text-grey-600">
                This is a modal overlay. Tap outside or press the button to
                close.
              </Text>
              <Button onPress={() => setModalVisible(false)}>Close</Button>
            </View>
          </Modal>
        </Section>

        <Divider />

        {/* Divider demo */}
        <Section title="Divider">
          <Text className="text-body-s text-grey-500">
            Dividers are the horizontal lines separating each section above.
          </Text>
          <Divider />
          <Divider className="bg-brand-blue" />
          <Divider className="bg-error" />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestScreen;
