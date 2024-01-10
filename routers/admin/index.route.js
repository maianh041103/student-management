const { systemConfig } = require('../../config/system');
const departmentRoute = require('./department.route');
const teacherRoute = require('./teacher.route');
const authRoute = require('./auth.route');
const myAccountRoute = require('./my-account.route');
const studentRoute = require('./student.route');

const authMiddlerware = require('../../middlerware/auth.middlerware');

module.exports = async (app) => {
  app.use(`${systemConfig.prefixAdmin}/department`, authMiddlerware.auth, departmentRoute);
  app.use(`${systemConfig.prefixAdmin}/teacher`, authMiddlerware.auth, teacherRoute);
  app.use(`${systemConfig.prefixAdmin}/auth`, authRoute);
  app.use(`${systemConfig.prefixAdmin}/my-account`, authMiddlerware.auth, myAccountRoute);
  app.use(`${systemConfig.prefixAdmin}/student`, authMiddlerware.auth, studentRoute);
}