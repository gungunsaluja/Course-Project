const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const { check } = require('express-validator');

router.post('/signup', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty()
], authController.signup);

router.post('/login', authController.login);
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.get('/me', passport.authenticate('jwt', { session: false }), authController.getMe);

module.exports = router;
