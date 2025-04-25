
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

router.post('/signup', [
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }),
  check('dob').isDate(),
  check('firstName').not().isEmpty(),
  check('lastName').not().isEmpty()
], authController.signup);

router.post('/login', authController.login);
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.post('/logout', authController.logout);

module.exports = router;
