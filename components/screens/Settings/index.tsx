import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { COLORS } from '@/constants/colors';
import type { IconName } from '@/constants/icons';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useTier } from '@/hooks/useTier';
import { cn } from '@/lib/cn';
import { hasProEntitlement, restorePurchases } from '@/lib/revenueCat';

type NotificationKey =
  | 'dailyReminder'
  | 'fillerAnalysisAlert'
  | 'friendRequest'
  | 'streakAtRisk';

type NotificationState = Record<NotificationKey, boolean>;

type LocalNotificationState = Omit<NotificationState, 'dailyReminder'>;

const DEFAULT_NOTIFICATIONS: LocalNotificationState = {
  fillerAnalysisAlert: true,
  friendRequest: true,
  streakAtRisk: true,
};

const Toggle = ({
  enabled,
  onPress,
  testID,
}: {
  enabled: boolean;
  onPress: () => void;
  testID: string;
}) => (
  <Pressable
    accessibilityLabel={enabled ? 'Disable setting' : 'Enable setting'}
    accessibilityRole="switch"
    accessibilityState={{ checked: enabled }}
    className={cn(
      'h-7 w-16 rounded-full p-0.5',
      enabled ? 'bg-black' : 'bg-grey-300'
    )}
    onPress={onPress}
    style={{ borderCurve: 'continuous' }}
    testID={testID}
  >
    <View
      className="h-6 w-[39px] rounded-full bg-white"
      style={{
        borderCurve: 'continuous',
        transform: [{ translateX: enabled ? 21 : 0 }],
      }}
    />
  </Pressable>
);

const SettingActionRow = ({
  destructive = false,
  icon,
  onPress,
  subtitle,
  testID,
  title,
  value,
}: {
  destructive?: boolean;
  icon: IconName;
  onPress: () => void;
  subtitle?: string;
  testID: string;
  title: string;
  value?: string;
}) => (
  <Pressable
    accessibilityLabel={title}
    accessibilityRole="button"
    className="flex-row items-center gap-6"
    onPress={onPress}
    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    testID={testID}
  >
    <View
      className="size-7 items-center justify-center rounded-full bg-white"
      style={{ borderCurve: 'continuous' }}
    >
      <Icon
        color={destructive ? COLORS.error[500] : COLORS.grey[500]}
        name={icon}
        size={18}
      />
    </View>

    <View className="flex-1 gap-1">
      <Text className="font-sf-rounded-medium text-body-lg text-black">
        {title}
      </Text>
      {subtitle ? (
        <Text className="font-sf-rounded-medium text-body-sm text-grey-500">
          {subtitle}
        </Text>
      ) : null}
    </View>

    <View className="flex-row items-center gap-4">
      {value ? (
        <Text className="font-sf-rounded-medium text-body-sm text-grey-500">
          {value}
        </Text>
      ) : null}
      <Icon color={COLORS.grey[700]} name="arrowUpRight" size={12} />
    </View>
  </Pressable>
);

const SettingToggleRow = ({
  enabled,
  icon,
  onToggle,
  subtitle,
  testID,
  title,
}: {
  enabled: boolean;
  icon: IconName;
  onToggle: () => void;
  subtitle: string;
  testID: string;
  title: string;
}) => (
  <Pressable
    accessibilityLabel={title}
    accessibilityRole="button"
    className="flex-row items-center gap-6"
    onPress={onToggle}
    style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
    testID={testID}
  >
    <View
      className="size-7 items-center justify-center rounded-full bg-white"
      style={{ borderCurve: 'continuous' }}
    >
      <Icon color={COLORS.grey[500]} name={icon} size={18} />
    </View>

    <View className="flex-1 gap-1">
      <Text className="font-sf-rounded-medium text-body-lg text-black">
        {title}
      </Text>
      <Text className="font-sf-rounded-medium text-body-sm text-grey-500">
        {subtitle}
      </Text>
    </View>

    <Toggle enabled={enabled} onPress={onToggle} testID={`${testID}.toggle`} />
  </Pressable>
);

export const Settings = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { isPro } = useTier();

  const [dailyReminderOverride, setDailyReminderOverride] = useState<
    boolean | null
  >(null);
  const [notifications, setNotifications] = useState<LocalNotificationState>(
    DEFAULT_NOTIFICATIONS
  );

  const dailyReminderEnabled =
    dailyReminderOverride ?? profile?.notifications_enabled ?? true;

  const handleToggle = (key: NotificationKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (key === 'dailyReminder') {
      const previous = dailyReminderEnabled;
      const nextValue = !previous;

      setDailyReminderOverride(nextValue);

      updateProfile.mutate(
        { notifications_enabled: nextValue },
        {
          onError: () => {
            setDailyReminderOverride(previous);

            Alert.alert(
              'Update failed',
              'Could not update notification preference.'
            );
          },
        }
      );

      return;
    }

    setNotifications((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleComingSoon = (title: string) => {
    Alert.alert(title, 'This action will be available soon.');
  };

  const performSignOut = async () => {
    try {
      await signOut();
    } catch {
      Alert.alert('Sign out failed', 'Please try again.');
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { style: 'cancel', text: 'Cancel' },
      {
        style: 'destructive',
        text: 'Sign out',
        onPress: () => {
          void performSignOut();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'Account deletion is not available in this build yet.'
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
      testID="settings.screen"
    >
      <View className="gap-6">
        <View
          className="relative h-12 flex-row items-center"
          testID="settings.header"
        >
          <IconButton
            accessibilityLabel="Go back"
            className="size-12 rounded-full"
            icon="arrowLeft"
            onPress={() => router.back()}
            testID="settings.back-btn"
            variant="filled"
          />

          <View
            className="absolute inset-0 items-center justify-center"
            pointerEvents="none"
          >
            <Text className="font-sf-rounded-semibold text-h4 text-black">
              Settings
            </Text>
          </View>
        </View>

        <View className="gap-6">
          <View
            className="gap-8 rounded-24 bg-grey-100 p-5"
            style={{ borderCurve: 'continuous' }}
          >
            <SettingActionRow
              icon="prompt"
              onPress={() => router.push('/prompt-categories')}
              testID="settings.choose-fillers"
              title="Choose filler words"
            />
            <SettingActionRow
              icon="clock"
              onPress={() => handleComingSoon('Daily practice goals')}
              testID="settings.daily-goals"
              title="Daily practice goals"
              value="10 mins"
            />
          </View>

          <View
            className="gap-8 rounded-24 bg-grey-50 p-5"
            style={{ borderCurve: 'continuous' }}
          >
            <SettingToggleRow
              enabled={dailyReminderEnabled}
              icon="clock"
              onToggle={() => handleToggle('dailyReminder')}
              subtitle="Nudge you to record each day"
              testID="settings.daily-reminder"
              title="Daily reminder"
            />
            <SettingToggleRow
              enabled={notifications.streakAtRisk}
              icon="fire"
              onToggle={() => handleToggle('streakAtRisk')}
              subtitle="Alert before midnight if you have not recorded"
              testID="settings.streak-risk"
              title="Streak at risk"
            />
            <SettingToggleRow
              enabled={notifications.fillerAnalysisAlert}
              icon="chart"
              onToggle={() => handleToggle('fillerAnalysisAlert')}
              subtitle="When your results are processed"
              testID="settings.filler-analysis"
              title="Filler analysis alert"
            />
            <SettingToggleRow
              enabled={notifications.friendRequest}
              icon="addFriend"
              onToggle={() => handleToggle('friendRequest')}
              subtitle="When someone adds you"
              testID="settings.friend-request"
              title="Friend request"
            />
          </View>

          <View
            className="gap-8 rounded-24 bg-grey-50 p-5"
            style={{ borderCurve: 'continuous' }}
          >
            {isPro ? (
              <SettingActionRow
                icon="crown"
                onPress={() =>
                  Linking.openURL(
                    'https://apps.apple.com/account/subscriptions'
                  )
                }
                testID="settings.manage-subscription"
                title="Manage Subscription"
                subtitle="Open App Store to manage your plan"
              />
            ) : (
              <SettingActionRow
                icon="crown"
                onPress={() => router.push('/paywall')}
                testID="settings.upgrade-pro"
                title="Upgrade to Pro"
                subtitle="Unlock unlimited recordings and more"
              />
            )}
            <SettingActionRow
              icon="clock"
              onPress={async () => {
                try {
                  const customerInfo = await restorePurchases();
                  if (hasProEntitlement(customerInfo)) {
                    Alert.alert(
                      'Restored!',
                      'Your Pro subscription has been restored.'
                    );
                  } else {
                    Alert.alert(
                      'No Subscription Found',
                      'We could not find an active subscription to restore.'
                    );
                  }
                } catch {
                  Alert.alert(
                    'Restore Failed',
                    'Something went wrong. Please try again.'
                  );
                }
              }}
              testID="settings.restore-purchases"
              title="Restore Purchases"
            />
          </View>

          <View
            className="gap-8 rounded-24 bg-grey-50 p-5"
            style={{ borderCurve: 'continuous' }}
          >
            <SettingActionRow
              icon="question"
              onPress={() => handleComingSoon('Privacy policy')}
              testID="settings.privacy"
              title="Privacy policy"
            />
            <SettingActionRow
              icon="copy"
              onPress={() => handleComingSoon('Terms & conditions')}
              testID="settings.terms"
              title="Terms & conditions"
            />
          </View>

          <View
            className="gap-8 rounded-24 bg-grey-50 p-5"
            style={{ borderCurve: 'continuous' }}
          >
            <SettingActionRow
              icon="trophy"
              onPress={() => handleComingSoon('Rate Speecha')}
              testID="settings.rate"
              title="Rate Speecha"
            />
            <SettingActionRow
              icon="edit"
              onPress={() => handleComingSoon('Send feedback')}
              testID="settings.feedback"
              title="Send feedback"
            />
          </View>

          <View
            className="gap-8 rounded-24 bg-grey-50 p-5"
            style={{ borderCurve: 'continuous' }}
          >
            <SettingActionRow
              icon="forward"
              onPress={handleSignOut}
              testID="settings.signout"
              title="Sign out"
            />
            <SettingActionRow
              destructive
              icon="trash"
              onPress={handleDeleteAccount}
              testID="settings.delete-account"
              title="Delete account"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
