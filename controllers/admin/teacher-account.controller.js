const GenerateAccount = require('../../models/generate-account.model');
const Teacher = require('../../models/teacher.model');
const Department = require('../../models/department.model');
const Role = require('../../models/role.model');

const generateHelper = require('../../helpers/generate.helper');
const { systemConfig } = require('../../config/system');
const md5 = require("md5");

//[GET] /admin/teacher-account/
module.exports.index = async (req, res) => {
  try {
    let listTeacherAccount = await GenerateAccount.find({
      deleted: false,
      type: "teacher"
    });

    for (const teacherAccount of listTeacherAccount) {
      const teacher = await Teacher.findOne({
        teacherCode: teacherAccount.code,
        deleted: false
      })
      const department = await Department.findOne({
        _id: teacher.id_department
      });
      teacher.departmentName = department.name;
      teacherAccount.teacherInfo = teacher;

      const role = await Role.findOne({
        deleted: false,
        _id: teacherAccount.role_id
      });
      if (role) {
        teacherAccount.roleName = role.name;
      } else {
        teacherAccount.roleName = "";
      }
    }

    res.render("admin/pages/teacher-account/index.pug", {
      pageTitle: "Danh sách tài khoản giảng viên",
      listTeacherAccount: listTeacherAccount
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy danh sách tài khoản giảng viên");
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  }
}

//[GET] /admin/teacher-account/create
module.exports.create = async (req, res) => {
  const listTeacher = await Teacher.find({
    deleted: false
  });
  let listCode = [];
  for (const teacher of listTeacher) {
    listCode.push(teacher.teacherCode);
  };

  const roles = await Role.find({
    deleted: false
  });
  res.render("admin/pages/teacher-account/create.pug", {
    pageTitle: "Thêm mới tài khoản giảng viên",
    listCode: listCode,
    roles: roles
  })
}

//[POST] /admin/teacher-account/createPOST
module.exports.createPOST = async (req, res) => {
  try {
    const emailExist = await GenerateAccount.findOne({
      email: req.body.email,
      type: "teacher",
      deleted: false
    });
    if (emailExist) {
      req.flash("error", "Email đã tồn tại");
      res.redirect(`${systemConfig.prefixAdmin}/teacher-account`);
      return;
    }
    const data = {
      email: req.body.email,
      password: md5(req.body.password),
      token: generateHelper.generateRandomString(20),
      type: "teacher",
      code: req.body.code,
      role_id: req.body.role_id
    }
    const newTeacher = new GenerateAccount(data);
    await newTeacher.save();
    req.flash("success", "Tạo mới tài khoản giảng viên thành công");
    res.redirect(`${systemConfig.prefixAdmin}/teacher-account`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Tạo mới tài khoản giảng viên thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/teacher-account`);
  }
}

//[GET] /admin/teacher-account/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const account = await GenerateAccount.findOne({
      _id: req.params.id,
      type: "teacher",
      deleted: false
    });
    const teacher = await Teacher.findOne({
      teacherCode: account.code
    });
    const department = await Department.findOne({
      _id: teacher.id_department,
      deleted: false
    });
    teacher.departmentName = department.name;
    account.infoTeacher = teacher;

    const role = await Role.findOne({
      deleted: false,
      _id: account.role_id
    });

    account.roleName = role ? role.name : "";

    res.render("admin/pages/teacher-account/detail.pug", {
      pageTitle: "Chi tiết tài khoản giảng viên",
      account: account
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thấy tìm thấy tài khoản giảng viên");
    res.redirect("back");
  }
}

//[GET] /admin/teacher-account/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const account = await GenerateAccount.findOne({
      _id: req.params.id,
      type: "teacher",
      deleted: false
    });

    const listTeacher = await Teacher.find({
      deleted: false
    });

    let listCode = [];
    for (const teacher of listTeacher) {
      listCode.push(teacher.teacherCode);
    }

    const roles = await Role.find({
      deleted: false
    });

    res.render("admin/pages/teacher-account/edit.pug", {
      pageTitle: "Chỉnh sửa thông tin tài khoản giảng viên",
      account: account,
      listCode: listCode,
      roles: roles
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy tài khoản giảng viên");
    res.redirect("back");
  }
}

//[PATCH] /admin/teacher-account/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    if (!req.body.password) {
      delete req.body.password
    }
    await GenerateAccount.updateOne({
      _id: req.params.id,
      type: "teacher",
      deleted: false
    }, req.body);

    req.flash("success", "Cập nhật thông tin tài khoản thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thông tin tài khoản thất bại");
    res.redirect("back");
  }
}

//[PATCH] /admin/teacher-account/changeStatus
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.query.id;
    let status = req.query.status;
    status = (status == "inactive" ? "active" : "inactive");
    await GenerateAccount.updateOne({
      _id: id,
      type: "teacher"
    }, {
      status: status
    });
    req.flash("success", "Cập nhật trạng thái tài khoản thành công");
    res.json({
      code: 200,
      messsage: "Cập nhật trạng thái thành công"
    });
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái tài khoản thất bại");
    res.json({
      code: 400,
      message: "Cập nhật trạng thái thất bại"
    });
  }
}

//[DELETE] /admin/teacher-account/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await GenerateAccount.updateOne({
      _id: id,
      type: "teacher"
    }, {
      deleted: true,
      deletedAt: new Date()
    })
    req.flash("success", "Xóa tài khoản thành công");
    res.json({
      code: 200,
      message: "Thành công"
    });
  } catch (error) {
    req.flash("error", "Xóa tài khoản thất bại");
    res.json({
      code: 400,
      message: "Thất bại"
    });
  }
}