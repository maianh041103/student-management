const authRoute = require('./auth.route');
const homeRoute = require('./home.route');
const userRoute = require('./user.route');

const authMiddlerware = require('../../middlerware/auth.middlerware');

module.exports = (app) => {
  app.use("/auth", authRoute);
  app.use("/home", authMiddlerware.authClient, homeRoute);
  app.use("/user", authMiddlerware.authClient, userRoute);
}