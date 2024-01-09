const Account = require("../models/account.model")

const { systemConfig } = require('../config/system');

module.exports.auth = async (req, res, next) => {
  try {
    const user = await Account.findOne({
      token: req.cookies.token,
      deleted: false
    });
    if (user) {
      res.locals.user = user;
      next();
      return;
    }
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }
}