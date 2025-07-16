import axios from 'axios';

//android emulator IP address
const API_BASE_URL = 'http://10.0.2.2:3000';

/** Login: Authenticate a user
 * @param username - The username of the user
 * @param password - The password of the user
 * @returns The authenticated user data or an error if authentication fails
 */
export async function login(username: string, password: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

/** Create: Create a new user
 * @param username - The username for the new user
 * @param password - The password for the new user
 * @returns The created user data or an error if creation fails
 */
export async function createUser(username: string, password: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Error during user creation:', error);
        throw error;
    }
}

/*
* Update: Update user password
* @param userId - The ID of the user whose password is to be updated
* @param newPassword - The new password for the user
* @returns The updated user data or an error if the update fails
*/
export async function updateUserPassword(userId: string, newPassword: string) {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${userId}/password`, { newPassword });
        return response.data;
    } catch (error) {
        console.error('Error during password update:', error);
        throw error;
    }
}
