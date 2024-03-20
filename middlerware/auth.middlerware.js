const Account = require("../models/account.model");
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
      res.locals.user = user;
      next();
      return;
    }
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }
}