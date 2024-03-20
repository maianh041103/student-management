const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const md5 = require("md5");

//[GET] /admin/admin-account/
module.exports.index = async (req, res) => {
  try {
    const listAccount = await Account.find({
      deleted: false
    });

    for (const account of listAccount) {
      const role = await Role.findOne({
        deleted: false,
        _id: account.role_id
      });
      account.roleName = role ? role.name : "";
    }

    res.render("admin/pages/admin-account/index", {
      pageTitle: "Danh sách tài khoản hệ thống",
      listAccount: listAccount
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy danh sách tài khoản admin");
    res.redirect("back");
  }
}

//[GET] /admin/admin-account/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const account = await Account.findOne({
      deleted: false,
      _id: req.params.id
    });

    const role = await Role.findOne({
      deleted: false,
      _id: account.role_id
    });
    account.roleName = role ? role.name : "";

    res.render("admin/pages/admin-account/detail", {
      pageTitle: "Chi tiết tài khoản",
      account: account
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy tài khoản");
    res.redirect("back");
  }
}

//[GET] /admin/admin-account/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const account = await Account.findOne({
      deleted: false,
      _id: req.params.id
    });

    const roles = await Role.find({
      deleted: false
    });

    res.render("admin/pages/admin-account/edit.pug", {
      pageTitle: "Chỉnh sửa tài khoản",
      account: account,
      roles: roles
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy tài khoản");
    res.redirect("back");
  }
}

//[PATCH] /admin/admin-account/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const account = await Account.findOne({
      _id: req.params.id,
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
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({
      _id: req.params.id
    }, req.body);
    req.flash("success", "Cập nhật thông tin tài khoản thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thông tin tài khoản thất bại");
    res.redirect("back");
  }
}

//[PATCH] /admin/admin-account/changeStatus
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.query.id;
    let status = req.query.status;
    newStatus = (status == "active" ? "inactive" : "active");
    await Account.updateOne({
      _id: id
    }, {
      status: newStatus
    });
    req.flash("success", "Cập nhật trạng thái thành công");
    res.json({
      code: 200,
      message: "Thành công"
    })
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại");
    res.json({
      code: 400,
      message: "Thất bại"
    })
  }
}

//[DELETE] /admin/admin-account/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Account.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date
    });
    req.flash("success", "Xóa tài khoản thành công");
    res.json({
      code: 200,
      message: "Xóa thành công"
    })
  } catch (error) {
    req.flash("error", "Xóa tài khoản thất bại");
    res.json({
      code: 400,
      message: "Xóa thất bại"
    });
  }
}

