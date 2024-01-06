const { systemConfig } = require('../../config/system');
const departmentRoute = require('../admin/department.route');

module.exports = async (app) => {
  app.use(`${systemConfig.prefixAdmin}/department`, departmentRoute);
}