const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express app
const app = express();
const PORT = 8001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'sae_database';

mongoose.connect(`${MONGO_URL}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✓ MongoDB connected successfully'))
.catch(err => console.error('✗ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  avatar: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// JWT Configuration
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production-sae-2025';
const ACCESS_TOKEN_EXPIRE_HOURS = 24;

// Utility Functions
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const createAccessToken = (userId) => {
  return jwt.sign(
    { sub: userId },
    SECRET_KEY,
    { expiresIn: `${ACCESS_TOKEN_EXPIRE_HOURS}h` }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    throw new Error('Could not validate credentials');
  }
};

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ detail: 'No token provided' });
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findOne({ id: payload.sub }).select('-password_hash');
    
    if (!user) {
      return res.status(401).json({ detail: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ detail: error.message });
  }
};

// Generate unique ID
const generateId = () => {
  return require('crypto').randomUUID();
};

// Routes

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'SAE API - Sistema de Autenticación Educativa' });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || username.length < 3 || username.length > 50) {
      return res.status(400).json({ detail: 'Username must be between 3 and 50 characters' });
    }
    if (!email) {
      return res.status(400).json({ detail: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ detail: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ detail: 'Email already registered' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ detail: 'Username already taken' });
    }

    // Create new user
    const user = new User({
      id: generateId(),
      username,
      email,
      password_hash: await hashPassword(password)
    });

    await user.save();

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    // Create access token
    const access_token = createAccessToken(user.id);

    res.json({
      access_token,
      token_type: 'bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    avatar: req.user.avatar,
    created_at: req.user.created_at,
    updated_at: req.user.updated_at
  });
});

// Get profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    avatar: req.user.avatar,
    created_at: req.user.created_at,
    updated_at: req.user.updated_at
  });
});

// Update profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    const updateData = { updated_at: new Date() };

    if (username) {
      // Check if username is taken by another user
      const existingUsername = await User.findOne({ 
        username, 
        id: { $ne: req.user.id } 
      });
      if (existingUsername) {
        return res.status(400).json({ detail: 'Username already taken' });
      }
      updateData.username = username;
    }

    if (email) {
      // Check if email is taken by another user
      const existingEmail = await User.findOne({ 
        email, 
        id: { $ne: req.user.id } 
      });
      if (existingEmail) {
        return res.status(400).json({ detail: 'Email already registered' });
      }
      updateData.email = email;
    }

    const updatedUser = await User.findOneAndUpdate(
      { id: req.user.id },
      { $set: updateData },
      { new: true }
    ).select('-password_hash');

    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Update password
app.put('/api/auth/password', authenticateToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ detail: 'New password must be at least 6 characters' });
    }

    // Get user with password hash
    const user = await User.findOne({ id: req.user.id });

    // Verify current password
    const isPasswordValid = await verifyPassword(current_password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ detail: 'Current password is incorrect' });
    }

    // Update password
    const newPasswordHash = await hashPassword(new_password);
    await User.findOneAndUpdate(
      { id: req.user.id },
      { 
        $set: { 
          password_hash: newPasswordHash,
          updated_at: new Date()
        } 
      }
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Update avatar
app.put('/api/auth/avatar', authenticateToken, async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ detail: 'Avatar is required' });
    }

    await User.findOneAndUpdate(
      { id: req.user.id },
      { 
        $set: { 
          avatar,
          updated_at: new Date()
        } 
      }
    );

    res.json({ 
      message: 'Avatar updated successfully',
      avatar 
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ detail: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SAE Backend running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Database: ${DB_NAME}`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  mongoose.connection.close();
  process.exit(0);
});