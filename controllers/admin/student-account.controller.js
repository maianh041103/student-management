const GenerateAccount = require('../../models/generate-account.model');
const Student = require('../../models/student.model');

const generateHelper = require('../../helpers/generate.helper');
const { systemConfig } = require('../../config/system');

const md5 = require("md5");

//[GET] /admin/student-account/
module.exports.index = async (req, res) => {
  let listStudentAccount = await GenerateAccount.find({
    deleted: false,
    type: "student"
  });

  for (const studentAccount of listStudentAccount) {
    const student = await Student.findOne({
      studentCode: studentAccount.code,
      deleted: false
    })
    studentAccount.studentInfo = student;
  }

  res.render("admin/pages/student-account/index.pug", {
    pageTitle: "Danh sách tài khoản sinh viên",
    listStudentAccount: listStudentAccount
  })
}

//[GET] /admin/student-account/create
module.exports.create = async (req, res) => {
  const listStudent = await Student.find({
    deleted: false
  });
  let listCode = [];
  for (const student of listStudent) {
    listCode.push(student.studentCode);
  };
  res.render("admin/pages/student-account/create.pug", {
    pageTitle: "Thêm mới tài khoản sinh viên",
    listCode: listCode
  })
}

//[POST] /admin/student-account/createPOST
module.exports.createPOST = async (req, res) => {
  try {
    const emailExist = await Student.findOne({
      email: req.body.email,
      deleted: false
    });
    if (emailExist) {
      req.flash("error", "Email đã tồn tại");
      res.redirect(`${systemConfig.prefixAdmin}/student-account`);
      return;
    }
    const data = {
      email: req.body.email,
      password: md5(req.body.password),
      token: generateHelper.generateRandomString(20),
      type: "student",
      code: req.body.code
    }
    const newStudent = new GenerateAccount(data);
    await newStudent.save();
    req.flash("success", "Tạo mới tài khoản sinh viên thành công");
    res.redirect(`${systemConfig.prefixAdmin}/student-account`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Tạo mới tài khoản sinh viên thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/student-account`);
  }
}

//[GET] /admin/student-account/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const account = await GenerateAccount.findOne({
      _id: req.params.id,
      deleted: false
    });
    const student = await Student.findOne({
      studentCode: account.code
    });
    account.infoStudent = student;

    res.render("admin/pages/student-account/detail.pug", {
      pageTitle: "Chi tiết tài khoản sinh viên",
      account: account
    });
  } catch (error) {
    req.flash("error", "Không thấy tìm thấy tài khoản sinh viên");
    res.redirect("back");
  }
}

//[GET] /admin/student-account/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const account = await GenerateAccount.findOne({
      _id: req.params.id,
      deleted: false
    });

    const listStudent = await Student.find({
      deleted: false
    });

    let listCode = [];
    for (const student of listStudent) {
      listCode.push(student.studentCode);
    }

    res.render("admin/pages/student-account/edit.pug", {
      pageTitle: "Chỉnh sửa thông tin tài khoản sinh viên",
      account: account,
      listCode: listCode
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy tài khoản sinh viên");
    res.redirect("back");
  }
}

//[PATCH] /admin/student-account/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    if (!req.body.password) {
      delete req.body.password
    }
    await GenerateAccount.updateOne({
      _id: req.params.id,
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

//[PATCH] /admin/student-account/changeStatus
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.query.id;
    let status = req.query.status;
    status = (status == "inactive" ? "active" : "inactive");
    await GenerateAccount.updateOne({
      _id: id
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

//[DELETE] /admin/student-account/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await GenerateAccount.updateOne({
      _id: id
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