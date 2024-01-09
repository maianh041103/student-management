const mongoose = require('mongoose');

const forgotPasswordShema = new mongoose.Schema({
  email: String,
  otp: String,
  expireAt: {
    type: Date,
    expires: 0
  }
}, {
  timestamps: true
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordShema, 'forgot-password');
module.exports = ForgotPassword;