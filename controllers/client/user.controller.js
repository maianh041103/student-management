const Student = require('../../models/student.model');
const Teacher = require('../../models/teacher.model');
const Department = require('../../models/department.model');
const ClassManagement = require('../../models/classManagement.model');
const ProfessionalTeam = require('../../models/professionalTeam.model');
const GenerateAccount = require('../../models/generate-account.model');

const md5 = require("md5");

//[GET] /user/info
module.exports.info = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user.type == "student") {
      const student = await Student.findOne({
        studentCode: user.code,
        deleted: false
      });
      if (student) {
        const classManagement = await ClassManagement.findOne({
          deleted: false,
          _id: student.id_classManagement
        });
        if (classManagement) {
          student.classManagementName = classManagement.name;
          const department = await Department.findOne({
            _id: classManagement.id_department,
            deleted: false
          });
          if (department) {
            student.departmentName = department.name;
          }
        }
        user.info = student;
      }
      else {
        const teacher = await Teacher.findOne({
          deleted: false,
          teacherCode: user.code
        });
        if (teacher) {
          const department = await Department.findOne({
            _id: teacher.id_department,
            deleted: false
          });
          if (department) {
            teacher.departmentName = department.name;
          }

          const professionalTeam = await ProfessionalTeam.findOne({
            _id: teacher.id_professionalTeam,
            deleted: false
          });
          if (professionalTeam) {
            teacher.professionalTeamName = professionalTeam.name;
          }
          user.info = teacher;
        }
      }
    }
    res.render("client/pages/user/info.pug", {
      pageTitle: "Thông tin cá nhân"
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy thông tin cá nhân");
    res.redirect("back");
  }
}

//[GET] /user/edit
module.exports.edit = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user.type == "student") {
      const student = await Student.findOne({
        studentCode: user.code,
        deleted: false
      });

      user.info = student;
    }
    else {
      const teacher = await Teacher.findOne({
        deleted: false,
        teacherCode: user.code
      });
      user.info = teacher;
    }

    res.render("client/pages/user/edit.pug", {
      pageTitle: "Thông tin cá nhân"
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy thông tin cá nhân");
    res.redirect("back");
  }
}

//[PATCH] /user/edit
module.exports.editPATCH = async (req, res) => {
  try {
    req.body.gender = parseInt(req.body.gender);
    if (!req.body.birthday) {
      delete req.body.birthday;
    }
    const type = res.locals.user.type;
    if (type == "student") {
      await Student.updateOne({
        studentCode: res.locals.user.code
      },
        req.body);
    } else {
      await Teacher.updateOne({
        teacherCode: res.locals.user.code
      },
        req.body);
    }
    req.flash("success", "Cập nhật thông tin tài khoản thành công");
    res.redirect("back");

  } catch (error) {
    console.log(error);
    req.flash("error", "Lỗi khi cập nhật thông tin tài khoản");
    res.redirect("back");
  }
}

//[GET] /user/changePassword
module.exports.changePassword = async (req, res) => {
  try {
    res.render("client/pages/user/changePassword", {
      pageTitle: "Đổi mật khẩu"
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể vào trang đổi mật khẩu");
    res.redirect("back");
  }
}

//[PATCH] /user/changePassword
module.exports.changePasswordPATCH = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user.password != md5(req.body.password)) {
      req.flash("error", "Mật khẩu cũ không chính xác");
      res.redirect("back");
      return;
    }
    if (req.body.newPassword != req.body.reNewPassword) {
      req.flash("error", "Xác nhận mật khẩu không chính xác");
      res.redirect("back");
      return;
    }
    if (user.password == md5(req.body.newPassword)) {
      req.flash("error", "Vui lòng nhập mật khẩu mới khác mật khẩu cũ");
      res.redirect("back");
      return;
    }
    await GenerateAccount.updateOne({
      _id: user._id
    }, {
      password: md5(req.body.newPassword)
    });
    req.flash("success", "Đổi mật khẩu thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Lỗi không đổi được mật khẩu");
    res.redirect("back");
  }
}