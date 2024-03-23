const GenerateAccount = require('../../models/generate-account.model');
const md5 = require("md5");

//[GET] /auth/login
module.exports.login = async (req, res) => {
  try {
    res.render("client/pages/auth/login.pug", {
      pageTitle: "Đăng nhập"
    });
  } catch (error) {
    console.log(error);
    req.flash("Không thể vào trang login");
    res.send("NOT FOUND");
  }
}

//[POST] /auth/login
module.exports.loginPOST = async (req, res) => {
  try {
    const accountExists = await GenerateAccount.findOne({
      email: req.body.email
    });
    if (!accountExists) {
      req.flash("error", "Email không tồn tại");
      res.redirect("back");
      return;
    }
    if (accountExists.password != md5(req.body.password)) {
      req.flash("error", "Mật khẩu không chính xác");
      res.redirect("back");
      return;
    }
    if (accountExists.status != "active") {
      req.flash("error", "Tài khoảng đang dừng hoạt động");
      res.redirect("back");
      return;
    }
    res.cookie("token", accountExists.token);
    res.redirect(`/home`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Đăng nhập thất bại");
    res.redirect("back");
  }
}

//[GET] /auth/logout
module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/auth/login");
  } catch (error) {
    req.flash("Đăng xuất thất bại");
    res.redirect("back");
  }
}
