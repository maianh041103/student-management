const md5 = require("md5");
const generateHelper = require('../../helpers/generate.helper');
const sendEmailHelper = require('../../helpers/sendEmail.helper');
const { systemConfig } = require('../../config/system');
const Account = require("../../models/account.model");
const ForgotPassword = require("../../models/forgot-password.model");

//[GET] /admin/auth/register
module.exports.register = async (req, res) => {
  res.render("admin/pages/auth/register.pug", {
    pageTitle: "Đăng kí"
  })
}

//[POST] /admin/auth/register
module.exports.registerPOST = async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPass) {
      req.flash("error", "Xác nhận mật khẩu không khớp");
      res.redirect("back");
      return;
    }
    const accountExists = await Account.findOne({
      email: req.body.email,
      deleted: false
    });
    if (accountExists) {
      req.flash("error", "Email đã tồn tại");
      res.redirect("back");
      return;
    }
    const data = {
      email: req.body.email,
      password: md5(req.body.password),
      token: generateHelper.generateRandomString(20),
      fullName: req.body.fullName,
      status: "active"
    }
    const newAccount = new Account(data);
    await newAccount.save();
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Tạo tài khoản thất bại");
    res.redirect("back");
  }
}

//[GET] /admin/auth/login
module.exports.login = async (req, res) => {
  res.render("admin/pages/auth/login.pug", {
    pageTitle: "Đăng nhập"
  })
}

//[POST] /admin/auth/login
module.exports.loginPOST = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const account = await Account.findOne({
      email: email,
      deleted: false
    });
    if (!account) {
      req.flash("error", "Email không tồn tại");
      res.redirect("back");
      return;
    }
    if (account.password === md5(password)) {
      res.cookie("token", account.token);
      res.redirect(`${systemConfig.prefixAdmin}/department`);
      return;
    }
    else {
      req.flash("error", "Mật khẩu không chính xác");
      res.redirect("back");
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "Đăng nhập thất bại");
    res.redirect("back");
  }
}

//[GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } catch (error) {
    req.flash("error", "Đăng xuất bị lỗi");
  }
}

//[GET] /admin/auth/forgot-password
module.exports.forgotPassword = async (req, res) => {
  res.render('admin/pages/auth/forgot-password.pug', {
    pageTitle: "Quên mật khẩu"
  });
}

//[POST] /admin/auth/forgot-password
module.exports.forgotPasswordPOST = async (req, res) => {
  try {
    const email = req.body.email;
    const accountExist = await Account.findOne({
      deleted: false,
      email: email
    });
    if (!accountExist) {
      req.flash("error", "Email không tồn tại");
      res.redirect("back");
      return;
    }

    //Send email
    const data = {
      email: email,
      otp: generateHelper.generateRandomNumber(6),
      expireAt: Date.now() + 300000
    };
    const dataForgotPassword = new ForgotPassword(data);
    await dataForgotPassword.save();

    const emailFrom = process.env.emailFrom;
    const subject = "Gửi mã OTP lấy lại mật khẩu";
    const html = `Mã OTP: ${data.otp}`;
    sendEmailHelper.sendEmail(emailFrom, email, subject, html);
    //End send email

    res.redirect(`${systemConfig.prefixAdmin}/auth/otp?email=${email}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể gửi mã OTP");
    res.redirect("back");
  }
}

//[GET] /admin/auth/otp
module.exports.otp = async (req, res) => {
  const email = req.query.email;
  res.render("admin/pages/auth/otp", {
    pageTitle: "Mã OTP",
    email: email
  })
}

//[POST] /admin/auth/otp
module.exports.otpPOST = async (req, res) => {
  try {
    const email = req.query.email;
    const checkOTP = await ForgotPassword.findOne({
      email: email,
      otp: req.body.otp
    });

    if (checkOTP) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/reset-password?email=${email}`)
    }
    else {
      req.flash("error", "Mã OTP không chính xác");
      res.redirect("back");
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "Mã OTP không chính xác");
    res.redirect("back");
  }
}

//[GET] /admin/auth/reset-password
module.exports.resetPassword = async (req, res) => {
  res.render("admin/pages/auth/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
    email: req.query.email
  });
}

//[POST] /admin/auth/reset-password
module.exports.resetPasswordPOST = async (req, res) => {
  try {
    const email = req.query.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password !== confirmPassword) {
      req.flash("error", "Xác nhận mật khẩu không khớp");
      res.redirect("back");
      return;
    } else {
      await Account.updateOne({
        email: email
      }, {
        password: md5(password)
      });
    }
    req.flash("success", "Đổi mật khẩu thành công");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } catch (error) {
    req.flash("error", "Dổi mật khẩu thất bại");
    res.redirect("back");
  }
}