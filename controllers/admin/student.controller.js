const Student = require('../../models/student.model');
const ClassManagement = require('../../models/classManagement.model');
const GenerateAccount = require('../../models/generate-account.model');

const generateHelper = require('../../helpers/generate.helper');
const md5 = require("md5");

const { systemConfig } = require('../../config/system');

//[GET] /admin/student
module.exports.index = async (req, res) => {
  const students = await Student.find({
    deleted: false
  });

  res.render("admin/pages/student/index", {
    pageTitle: "Danh sách sinh viên",
    students: students
  });
}

//[GET] /admin/student/create
module.exports.create = async (req, res) => {
  const classManagements = await ClassManagement.find({
    deleted: false
  });
  res.render("admin/pages/student/create.pug", {
    pageTitle: "Thêm sinh viên",
    classManagements: classManagements
  })
}

//[POST] /admin/student/create
module.exports.createPOST = async (req, res) => {
  try {
    if (req.body.course) {
      req.body.course = req.body.course;
    }
    if (req.body.gender) {
      req.body.gender = req.body.gender;
    }
    req.body.studentCode = generateHelper.generateRandomNumber(5) + req.body.course.toString();
    const newStudent = new Student(req.body);
    await newStudent.save();

    //Tự động sinh tài khoản
    const dataGenerateAccount = {
      email: generateHelper.generateEmail(newStudent.name, newStudent.studentCode),
      password: md5(generateHelper.generatePassword(newStudent.birthday)),
      token: generateHelper.generateRandomString(20),
      type: "student",
      code: req.body.studentCode
    }

    const newAccount = new GenerateAccount(dataGenerateAccount);
    await newAccount.save();
    //End tự động sinh tài khoản

    req.flash("success", "Thêm sinh viên thành công");
    res.redirect(`${systemConfig.prefixAdmin}/student`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm sinh viên thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/student`);
  }
}

//[GET] /admin/student/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findOne({
      _id: id,
      deleted: false
    });

    const account = await GenerateAccount.findOne({
      code: student.studentCode
    });

    res.render("admin/pages/student/detail.pug", {
      pageTitle: "Thông tin sinh viên",
      student: student,
      account: account
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sinh viên");
    res.redirect("back");
  }
}

//[GET] /admin/student/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findOne({
      _id: id,
      deleted: false
    });

    const classManagements = await ClassManagement.find({
      deleted: false
    });

    res.render("admin/pages/student/edit.pug", {
      pageTitle: "Chỉnh sửa thông tin sinh viên",
      student: student,
      classManagements: classManagements
    })
  } catch (error) {
    req.flash("error", "Không tìm thấy sinh viên");
    res.redirect("back");
  }
}

//[PATCH] /admin/student/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    if (req.body.course) {
      req.body.course = parseInt(req.body.course);
    }
    if (req.body.gender) {
      req.body.gender = parseInt(req.body.gender);
    }
    if (req.body.birthday == '') {
      delete req.body.birthday;
    }
    await Student.updateOne({
      deleted: false,
      _id: req.params.id
    }, req.body);
    req.flash("success", "Cập nhật thông tin sinh viên thành công");
    res.redirect("back");
  } catch (error) {
    req.falsh("error", "Cập nhật thông tin sinh viên thất bại");
    res.redirect("back");
  }
}

//[PACTH] /admin/student/changeStatus
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.query.id;
    let status = req.query.status;
    if (status == "active") {
      status = "complete";
    } else if (status == "inactive") {
      status = "active"
    } else {
      status = "inactive"
    }
    await Student.updateOne({
      _id: id
    }, {
      status: status
    });
    req.flash("success", "Cập nhật trạng thái sinh viên thành công");
    res.json({
      code: 200,
      messsage: "Cập nhật trạng thái thành công"
    });
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái sinh viên thất bại");
    res.json({
      code: 400,
      message: "Cập nhật trạng thái thất bại"
    });
  }
}

//[DELETE] /admin/student/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findOne({
      _id: id
    });
    await Student.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date()
    });

    await GenerateAccount.updateOne({
      code: student.studentCode
    }, {
      deleted: true,
      deletedAt: new Date()
    })
    req.flash("success", "Xóa sinh viên thành công");
    res.json({
      code: 200,
      message: "Thành công"
    });
  } catch (error) {
    req.flash("error", "Xóa sinh viên thất bại");
    res.json({
      code: 400,
      message: "Thất bại"
    });
  }
}