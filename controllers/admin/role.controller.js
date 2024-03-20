const Role = require("../../models/role.model");

const { systemConfig } = require("../../config/system");

//[GET] /admin/role/
module.exports.index = async (req, res) => {
  try {
    const roles = await Role.find({
      deleted: false
    });

    res.render("admin/pages/role/index.pug", {
      pageTitle: "Phân quyền",
      roles: roles
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy danh sách nhóm quyền");
    res.redirect("back");
  }
}

//[GET] /admin/role/create
module.exports.create = async (req, res) => {
  try {
    res.render("admin/pages/role/create.pug", {
      pageTitle: "Thêm mới nhóm quyền"
    });
  } catch (error) {
    console.log(error);
    req.flash("Không thể vào trang thêm nhóm quyền");
    res.redirect("back");
  }
}

//[POST] /admin/role/create
module.exports.createPOST = async (req, res) => {
  try {
    const name = req.body.name;
    const roleExists = await Role.findOne({
      name: name,
      deleted: false
    });
    if (roleExists) {
      req.flash("error", "Nhóm quyền đã tồn tại");
      res.redirect("back");
      return;
    }
    const role = new Role(req.body);
    await role.save();
    req.flash("success", "Thêm mới nhóm quyền thành công");
    res.redirect(`${systemConfig.prefixAdmin}/role`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm mới nhóm quyền thất bại");
    res.redirect("back");
  }
}

//[GET] /admin/role/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const role = await Role.findOne({
      _id: req.params.id,
      deleted: false
    });
    console.log(role);
    res.render("admin/pages/role/detail.pug", {
      pageTitle: "Chi tiết nhóm quyền",
      role: role
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể tìm thấy chi tiết nhóm quyền");
    res.redirect("back");
  }
}

//[GET] /admin/role/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const role = await Role.findOne({
      _id: req.params.id,
      deleted: false
    });
    res.render("admin/pages/role/edit.pug", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      role: role
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không vào được trang chỉnh sửa quyền");
    res.redirect("back");
  }
}

//[PATCH] /admin/role/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    await Role.updateOne({
      _id: req.params.id,
      deleted: false
    }, req.body);
    req.flash("success", "Chỉnh sửa thông tin nhóm quyền thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Chỉnh sửa thông tin nhóm quyền thất bại");
    res.redirect("back");
  }
}

//[PATCH] /admin/role/changeStatus
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.query.id;
    let status = req.query.status;
    newStatus = (status == "active" ? "inactive" : "active");
    await Role.updateOne({
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

//[DELETE] /admin/role/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date
    });
    req.flash("success", "Xóa nhóm quyền thành công");
    res.json({
      code: 200,
      message: "Xóa thành công"
    })
  } catch (error) {
    req.flash("error", "Xóa nhóm quyền thất bại");
    res.json({
      code: 400,
      message: "Xóa thất bại"
    });
  }
}

//[GET] /admin/role/permissions
module.exports.permissions = async (req, res) => {
  try {
    const roles = await Role.find({
      deleted: false
    });
    res.render("admin/pages/role/permissions", {
      pageTitle: "Phân quyền",
      roles: roles
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể vào trang phân quyền");
    res.redirect("back");
  }
}

//[PATCH] /admin/role/permissions
module.exports.permissionsPATCH = async (req, res) => {
  try {
    const data = req.body;
    for (const element of data) {
      await Role.updateOne({
        _id: element.role_id
      }, {
        permissions: element.permissions
      });
    }
    res.json({
      code: 200,
      message: "Cập nhật thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật thất bại"
    });
  }
}