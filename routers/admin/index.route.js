const { systemConfig } = require('../../config/system');
const departmentRoute = require('./department.route');
const teacherRoute = require('./teacher.route');
const authRoute = require('./auth.route');
const myAccountRoute = require('./my-account.route');
const studentRoute = require('./student.route');
const studentAccountRoute = require('./student-account.route');
const teacherAccountRoute = require('./teacher-account.route');
const courseRoute = require('./course.route');
const programFrameRoute = require('./programFrame.route');
const classRoomRoute = require('./classRoom.route');
const classManagementRoute = require('./classManagement.route');
const dashboardRoute = require('./dashboard.route');
const adminAccountRoute = require('./admin-account.route');

const authMiddlerware = require('../../middlerware/auth.middlerware');

module.exports = async (app) => {
  app.use(`${systemConfig.prefixAdmin}/department`, authMiddlerware.auth, departmentRoute);
  app.use(`${systemConfig.prefixAdmin}/teacher`, authMiddlerware.auth, teacherRoute);
  app.use(`${systemConfig.prefixAdmin}/auth`, authRoute);
  app.use(`${systemConfig.prefixAdmin}/my-account`, authMiddlerware.auth, myAccountRoute);
  app.use(`${systemConfig.prefixAdmin}/student`, authMiddlerware.auth, studentRoute);
  app.use(`${systemConfig.prefixAdmin}/student-account`, authMiddlerware.auth, studentAccountRoute);
  app.use(`${systemConfig.prefixAdmin}/teacher-account`, authMiddlerware.auth, teacherAccountRoute);
  app.use(`${systemConfig.prefixAdmin}/course`, authMiddlerware.auth, courseRoute);
  app.use(`${systemConfig.prefixAdmin}/programFrame`, authMiddlerware.auth, programFrameRoute);
  app.use(`${systemConfig.prefixAdmin}/classRoom`, authMiddlerware.auth, classRoomRoute);
  app.use(`${systemConfig.prefixAdmin}/classManagement`, authMiddlerware.auth, classManagementRoute);
  app.use(`${systemConfig.prefixAdmin}`, authMiddlerware.auth, dashboardRoute);
  app.use(`${systemConfig.prefixAdmin}/admin-account`, authMiddlerware.auth, adminAccountRoute);
}