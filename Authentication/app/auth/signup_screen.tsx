import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { createUser } from '../DataLayer/mongoconnection';

//tailwind css by chat gpt
//generated error fix for user alerts 
export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!email || !password) {
      console.log('Error: Please fill in all fields.');
      return;
    }

    try {
      const response = await createUser(email, password);
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }

      const userId = response.userId;
      Alert.alert('Success', 'User created successfully.');

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
        Alert.alert('Error', 'An error occurred during signup.');
      }
    }
  };

  return (
    <View className="flex-1 justify-center px-5 bg-white">
      <Text className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</Text>

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
        className="bg-green-600 py-3 rounded-lg mb-4"
        onPress={handleSignup}
      >
        <Text className="text-white text-center font-semibold text-base">
          Sign Up
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push('/auth/login_screen')}>
        <Text className="text-blue-500 text-center text-sm mt-2">
          Already have an account? Login
        </Text>
      </Pressable>
    </View>
  );
}
