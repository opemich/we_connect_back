const express = require('express');
const { body } = require('express-validator');
const authController = require('../controller/auth.controller');
// const sendResetPasswordEmail = require('../utils/sendEmail'); 
const router = express.Router();

router.post('/forgot-password',
  [body('email').isEmail().withMessage('Invalid email')],
  authController.forgotPassword);

router.get('/reset-password/:token', authController.verifyResetToken);

router.patch('/reset-password/:token',
  [
    body('password')
      .isLength({ min: 8 })
      .withMessage('Must be 8+ chars')
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Must include upper, lower, and number'),
    body('confirmPassword')
      .custom((val, { req }) => {
        if (val !== req.body.password) {
          throw new Error('Passwords must match');
        }
        return true;
      })
  ],
  authController.resetPassword);

module.exports = router;