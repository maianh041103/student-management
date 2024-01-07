const { systemConfig } = require('../../config/system');
const departmentRoute = require('../admin/department.route');
const teacherRoute = require('../admin/teacher.route');

module.exports = async (app) => {
  app.use(`${systemConfig.prefixAdmin}/department`, departmentRoute);
  app.use(`${systemConfig.prefixAdmin}/teacher`, teacherRoute);
}