const Account = require('../../models/account.model');
const md5 = require("md5");

//[GET] /admin/my-account
module.exports.index = async (req, res) => {
  const token = req.cookies.token;
  const account = await Account.findOne({
    token: token,
    deleted: false,
    status: "active"
  })
  res.render("admin/pages/my-account/index.pug", {
    pageTitle: "Thông tin tài khoản",
    account: account
  })
}

//[GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  const token = req.cookies.token;
  const account = await Account.findOne({
    token: token,
    deleted: false,
    status: "active"
  })
  res.render("admin/pages/my-account/edit.pug", {
    pageTitle: "Sửa thông tin cá nhân",
    account: account
  })
}

//[PATCH] /admin/my-account/edit
module.exports.editPATCH = async (req, res) => {
  try {
    const account = await Account.findOne({
      token: req.cookies.token,
      deleted: false
    });
    const email = req.body.email;
    const emailExists = await Account.findOne({
      $and: [
        { email: email },
        {
          email: {
            $ne: account.email
          }
        },
      ],
      deleted: false
    });
    if (emailExists) {
      req.flash("error", "Địa chỉ email đã tồn tại");
      res.redirect("back");
      return;
    }
    if (req.body.password != '') {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({
      token: req.cookies.token
    }, req.body);
    req.flash("success", "Cập nhật thông tin cá nhân thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thông tin cá nhân thất bại");
    res.redirect("back");
  }
}