import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export const SignIn = () => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) Alert.alert('Sign in failed', error.message);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        Alert.alert('Sign up failed', error.message);
      } else {
        Alert.alert('Check your email', 'A confirmation link has been sent.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 justify-center px-6">
        <View className="gap-8">
          <View className="gap-2">
            <Text className="text-center font-sf-rounded-bold text-h2 text-black">
              Speecha
            </Text>
            <Text className="text-center font-sf-rounded-medium text-body-md text-grey-500">
              Dev Sign In
            </Text>
          </View>

          <View className="gap-4">
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              className="h-14 rounded-2xl bg-grey-100 px-4 font-sf-rounded-medium text-body-md text-black"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#a4a7ae"
              style={{ borderCurve: 'continuous' }}
              testID="sign-in.email"
              value={email}
            />
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              className="h-14 rounded-2xl bg-grey-100 px-4 font-sf-rounded-medium text-body-md text-black"
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#a4a7ae"
              secureTextEntry
              style={{ borderCurve: 'continuous' }}
              testID="sign-in.password"
              value={password}
            />
          </View>

          <View className="gap-3">
            <Button
              disabled={isLoading || !email || !password}
              onPress={handleSignIn}
              testID="sign-in.submit"
              title={isLoading ? 'Signing in...' : 'Sign In'}
            />
            <Button
              disabled={isLoading || !email || !password}
              onPress={handleSignUp}
              testID="sign-in.sign-up"
              title="Create Account"
              variant="secondary"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
