const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

const SECRET_KEY = 'your_secret_key'; // Change to a secure key

// Mock user for demo
const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$W9kU.BHIC9OsAFzTLN3vgujTmngXpJlRQQr1pA2/ntO.YUsXiwY2a' // Hashed "password"
  }
];

// Login Route - Generate JWT with Unique ID
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate unique token with UUID
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      jti: uuidv4() // Add unique identifier to token
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Login successful',
    token
  });
});

// Protected Route - Verify Token
app.get('/api/profile', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
    res.json({
      message: 'Profile accessed successfully',
      user: decoded
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
