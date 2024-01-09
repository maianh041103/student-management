const express = require('express');
const route = express.Router();
const controller = require('../../controllers/admin/auth.controller');

route.get('/register', controller.register);

route.post('/register', controller.registerPOST);

route.get('/login', controller.login);

route.post('/login', controller.loginPOST);

route.get('/logout', controller.logout);

route.get('/forgot-password', controller.forgotPassword);

route.post('/forgot-password', controller.forgotPasswordPOST);

route.get('/otp', controller.otp);

route.post('/otp', controller.otpPOST);

route.get('/reset-password', controller.resetPassword);

route.post('/reset-password', controller.resetPasswordPOST);

module.exports = route;