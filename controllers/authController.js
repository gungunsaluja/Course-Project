const User = require('../models/user');
const passport = require('passport');
const generateToken = require('../utils/generateToken');

exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, dob } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      dob: new Date(dob),
      university: req.body.university || 'Unknown'
    });

    await user.save();
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

exports.googleCallback = (req, res) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err) return res.redirect(`${process.env.CLIENT_URL}/login?error=true`);
    
    const token = generateToken(user._id);
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  })(req, res);
};

exports.login = async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  })(req, res, next);
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
