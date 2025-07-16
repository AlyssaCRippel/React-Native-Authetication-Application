import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { verifyInstallation } from 'nativewind';
import { login } from '../DataLayer/mongoconnection';

//tailwind css by chat gpt
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await login(email, password);
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }

      const user = response.user;
      if (user) {
        const userId = user._id;
        router.setParams({ user: userId });
        router.push({ pathname: `/auth/update_screen`, params: { user: userId } });
      } else {
        Alert.alert('Error', 'Invalid email or password.');
      }
    } catch (error) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as any).response === 'object' &&
          (error as any).response !== null &&
          'data' in (error as any).response &&
          typeof (error as any).response.data === 'object' &&
          (error as any).response.data !== null &&
          'message' in (error as any).response.data
        ) {
          Alert.alert('Error', (error as any).response.data.message);
        } else {
          Alert.alert('Error', 'An error occurred during login.');
        }
      }
  };
  return (
    <View className="flex-1 justify-center px-5 bg-white">
      <Text className="text-3xl font-bold text-center mb-6 text-gray-800">Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-base"
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 rounded-md px-4 py-3 mb-6 text-base"
        placeholderTextColor="#888"
      />

      <Pressable
        className="bg-blue-600 py-3 rounded-lg mb-4"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-semibold text-base">Login</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/auth/signup_screen')}>
        <Text className="text-blue-500 text-center text-sm mt-2">
          Don't have an account? Sign up
        </Text>
      </Pressable>
    </View>
  );
}
