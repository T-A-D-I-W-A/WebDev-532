const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;
const API_KEY = 'EXAM2024-KEY-5678';

app.use(express.json());

// CORS headers for cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  next();
});

// Read users data
const getUsersData = () => {
  try {
    const usersPath = path.join(__dirname, 'users.json');
    if (!fs.existsSync(usersPath)) {
      fs.writeFileSync(usersPath, JSON.stringify([]));
      return [];
    }
    return JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
};

// Save users data
const saveUsersData = (users) => {
  try {
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to users.json:', error);
    return false;
  }
};

// Basic validations
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) => password && password.length >= 8;

// API key middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const users = getUsersData();
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword
    };

    users.push(newUser);
    if (!saveUsersData(users)) {
      return res.status(500).json({ error: 'Error saving user data' });
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = getUsersData();
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _, ...userData } = user;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Profile endpoint (protected)
app.get('/api/profile', validateApiKey, (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const users = getUsersData();
    const user = users.find(user => user.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update username endpoint (PATCH)
app.patch('/api/profile', validateApiKey, (req, res) => {
  try {
    const { userId, username } = req.body;
    if (!userId || !username) {
      return res.status(400).json({ error: 'User ID and username are required' });
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: 'Username must not contain special characters' });
    }

    const users = getUsersData();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex].username = username;
    if (!saveUsersData(users)) {
      return res.status(500).json({ error: 'Error saving user data' });
    }

    const { password, ...userData } = users[userIndex];
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});