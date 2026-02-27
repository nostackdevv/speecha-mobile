import { useState } from "react";
import { Text, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { TestScreen } from "../test";

export const HomeScreen = () => {
  const { isAuthenticated, isLoading, signInWithGoogle, signOut, user } =
    useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      await signOut();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign out failed");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6 dark:bg-black">
      {/* {isAuthenticated ? (
        <>
          <Text className="text-lg font-bold text-black dark:text-white">
            Signed in as
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            {user?.email}
          </Text>
          <Pressable
            className="mt-4 rounded-lg bg-red-500 px-6 py-3 active:opacity-70"
            onPress={handleSignOut}
          >
            <Text className="font-semibold text-white">Sign Out</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          className="rounded-lg bg-blue-500 px-6 py-3 active:opacity-70"
          onPress={handleGoogleSignIn}
        >
          <Text className="font-semibold text-white">Sign in with Google</Text>
        </Pressable>
      )} */}
      <TestScreen />
      {error && <Text className="mt-2 text-center text-red-500">{error}</Text>}
    </View>
  );
};

export default HomeScreen;
