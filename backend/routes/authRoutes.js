// const express =require('express');
// const {register ,loginUser,getUserProfile} =require('../controllers/authController');
// const {protect} =require('../middleware/authMiddleware');
// const router = express.Router();
// router.route('/').post(register);
// router.post('/login',loginUser);
// router.route('/profile').get(protect,getUserProfile);
// module.exports = router;

// router.post('/signup', async (req, res) => {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const user = await User.create({email:req.body.email, password: hashedPassword});
//     const {accessToken, refreshToken} = generateAccessToken(user);
//     res.cookie('refreshToken', refreshToken, {httpOnly:true});
//     res.json({accessToken});

// });
// // login
// router.post('./login', async (req, res) => {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user || !await bcrypt.compare(req.body.password, user.password)) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }
//     const { accessToken, refreshToken } = generateAccessToken(user);
//     res.cookie('refreshToken', refreshToken, { httpOnly: true });
//     res.json({ accessToken });
// });const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
  } = require('../controllers/authController');
  const { protect } = require('../middleware/authMiddleware');
  
  const router = express.Router();
  
  router.post('/register', registerUser);
  router.post('/login', loginUser);
  router.get('/profile', protect, getUserProfile);
  
  module.exports = router;
  