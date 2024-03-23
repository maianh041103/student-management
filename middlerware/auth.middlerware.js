const Account = require("../models/account.model");
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const GenerateAccount = require('../models/generate-account.model');
const Role = require("../models/role.model");

const { systemConfig } = require('../config/system');

module.exports.auth = async (req, res, next) => {
  try {
    const user = await Account.findOne({
      token: req.cookies.token,
      deleted: false
    });
    if (user) {
      const role = await Role.findOne({
        _id: user.role_id,
        deleted: false
      });
      user.permissions = role ? role.permissions : [];
      user.type = "admin";
      res.locals.user = user;
      next();
      return;
    }
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }
}

module.exports.authClient = async (req, res, next) => {
  try {
    const user = await GenerateAccount.findOne({
      token: req.cookies.token,
      deleted: false
    });
    if (user) {
      const role = await Role.findOne({
        _id: user.role_id,
        deleted: false
      });
      user.permissions = role ? role.permissions : [];

      if (user.type == "student") {
        const student = await Student.findOne({
          studentCode: user.code
        });
        user.info = student;
      }
      else {
        const teacher = await Teacher.findOne({
          teacherCode: user.code
        });
        user.info = teacher;
      }

      res.locals.user = user;
      next();
      return;
    }
    res.redirect(`/auth/login`);
  } catch (error) {
    res.redirect(`/auth/login`);
  }
}