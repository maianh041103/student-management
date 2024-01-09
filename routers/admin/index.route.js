const { systemConfig } = require('../../config/system');
const departmentRoute = require('./department.route');
const teacherRoute = require('./teacher.route');
const authRoute = require('./auth.route');

module.exports = async (app) => {
  app.use(`${systemConfig.prefixAdmin}/department`, departmentRoute);
  app.use(`${systemConfig.prefixAdmin}/teacher`, teacherRoute);
  app.use(`${systemConfig.prefixAdmin}/auth`, authRoute);
}