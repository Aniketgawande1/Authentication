// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/auth');

// const app = express();

// // Middleware
// app.use(express.json());

// // Database
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('🚀💖Connected to ✅MongoDB'))
//   .catch(err => console.log(err));

// // Routes
// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');

// // Initialize Express
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// // Database Connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.log(err));

// // User Model
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// }, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// // Compare passwords
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// // Auth Middleware
// const requireAuth = (req, res, next) => {
//   const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
  
//   if (!token) {
//     return res.status(401).json({ error: 'Authentication required' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// // Routes
// // Register
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already in use' });
//     }

//     const user = await User.create({ email, password });
    
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1h'
//     });

//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 3600000
//     });

//     res.status(201).json({
//       message: 'User registered successfully',
//       user: { id: user._id, email: user.email }
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Login
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
    
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1h'
//     });

//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 3600000
//     }).json({
//       message: 'Login successful',
//       user: { id: user._id, email: user.email }
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Logout
// app.post('/api/auth/logout', (req, res) => {
//   res.clearCookie('token').json({ message: 'Logged out successfully' });
// });

// // Protected Profile
// app.get('/api/auth/profile', requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// User Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Authentication Middleware
const requireAuth = (req, res, next) => {
  // Check for token in cookies or Authorization header
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentication required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      error: 'Invalid or expired token' 
    });
  }
};

// Routes

// 1. Register Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use'
      });
    }

    // Create new user
    const user = await User.create({ email, password });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });

    // Return success response with token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email
      },
      token: token // Explicitly return token in response
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// 2. Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });

    // Return success response with token
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email
      },
      token: token // Explicitly return token in response
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// 3. Logout Endpoint
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token')
    .json({
      success: true,
      message: 'Logged out successfully'
    });
});

// 4. Protected Profile Endpoint
app.get('/api/auth/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password'); // Exclude password field
    
    res.json({
      success: true,
      user: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// 5. Validate Token Endpoint (optional)
app.get('/api/auth/validate', requireAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      userId: req.user.userId
    }
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});