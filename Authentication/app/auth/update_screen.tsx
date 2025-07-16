import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateUserPassword } from '../DataLayer/mongoconnection';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';

//tailwind by chat gpt
export default function UpdateScreen({ navigation }: any) {
    const userId = useSearchParams().get('user');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        try {
            const result = await updateUserPassword(userId ? userId : '', password);
            if (result.status != 500) {
                Alert.alert('Success', 'Password updated successfully!');
            } else {
                Alert.alert('Error', 'Failed to update password.');
            }

            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            if (
                error instanceof Object &&
                'response' in error &&
                error.response instanceof Object &&
                'data' in error.response &&
                error.response.data instanceof Object &&
                'message' in error.response.data &&
                typeof error.response.data.message === 'string'
            ) {
                Alert.alert('Error', error.response.data.message);
            } else {
                Alert.alert('Error', 'An error occurred while updating the password.');
            }
        }
    };

    const handleLogout = () => {
        Alert.alert('Logged out', 'You have been logged out.');
        navigation.navigate('auth/login_screen'); 
    };

    return (
        <View className="flex-1 justify-center px-5 bg-white">
            <Text className="text-3xl font-bold text-center mb-6 text-gray-800">Update Password</Text>
            <TextInput
                className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-base"
                placeholder="New Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                className="border border-gray-300 rounded-md px-4 py-3 mb-6 text-base"
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <Button title="Update Password" onPress={handleUpdatePassword} />
            <View className="mt-8">
                <Button title="Logout" color="red" onPress={handleLogout} />
            </View>
        </View>
    );
};