const express = require('express');
const { MongoClient } = require('mongodb');
const CryptoJS = require('crypto-js');
const { v4: uuidv4 } = require('uuid');

//chat got generated password validation regex and email validation regex
//also generated some hashing logic for password hashing and salting

const app = express();
const port = 3000;

const uri = 'mongodb://localhost:27017';
const dbName = 'authApp';
const collectionName = 'users';

let client;

// Connect to MongoDB and return the collection
async function connect() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
    return client.db(dbName).collection(collectionName);
}

app.use(express.json());

const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!hasUpperCase) {
        return { valid: false, message: 'Password must include at least one uppercase letter.' };
    }
    if (!hasLowerCase) {
        return { valid: false, message: 'Password must include at least one lowercase letter.' };
    }
    if (!hasNumber) {
        return { valid: false, message: 'Password must include at least one number.' };
    }
    if (!hasSpecialChar) {
        return { valid: false, message: 'Password must include at least one special character.' };
    }
    if (!isLongEnough) {
        return { valid: false, message: 'Password must be at least 8 characters long.' };
    }

    return { valid: true };
};

const validateEmail = (email) => {
    const hasAtSymbol = /@/.test(email);
    const hasDomain = /\.[a-z]{2,}$/.test(email);
    const noSpaces = !/\s/.test(email);

    if (!hasAtSymbol) {
        return { valid: false, message: 'Email must include an @ symbol.' };
    }
    if (!hasDomain) {
        return { valid: false, message: 'Email must include a valid domain (e.g., .com, .org).' };
    }
    if (!noSpaces) {
        return { valid: false, message: 'Email must not contain spaces.' };
    }

    return { valid: true };
};

/*
* Login Endpoint to authenticate a user
* @param username - The username of the user
* @param password - The password of the user
* @returns The authenticated user data or an error if authentication fails
*/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const collection = await connect();

    const user = await collection.findOne({ username });

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const { salt, password: storedHashedPassword } = user;
    const hashPassword = (password) =>
        CryptoJS.SHA256(password + salt).toString();

    const hashedPassword = hashPassword(password);

    if (hashedPassword === storedHashedPassword) {
        res.status(200).json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

/*
* Create Endpoint to create a new user
* @param username - The username for the new user
* @param password - The password for the new user
* @returns The created user data or an error if creation fails
*/
app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    const collection = await connect();

    const userId = uuidv4(); // Generate a UUID for the user
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const hashPassword = (password) =>
        CryptoJS.SHA256(password + salt).toString();

    const hashedPassword = hashPassword(password);

    const result = await collection.insertOne({ _id: userId, username, password: hashedPassword, salt });
    res.status(201).json({ message: 'User created', userId });
});

/*
* Update Endpoint to update user password
* @param userId - The ID of the user whose password is to be updated
* @param newPassword - The new password for the user
* @returns The updated user data or an error if the update fails
*/
app.put('/users/:id/password', async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    const collection = await connect();

    console.log('Received user ID:', id); // Log the ID for debugging

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
        return res.status(400).json({ message: passwordValidation.message });
    }

    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const hashPassword = (password) =>
        CryptoJS.SHA256(password + salt).toString();

    const hashedPassword = hashPassword(newPassword);

    const result = await collection.updateOne(
        { _id: id },
        { $set: { password: hashedPassword, salt } } // Include salt in the update
    );

    if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Password updated successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
