const Student = require('../../models/student.model');
const Teacher = require('../../models/teacher.model');
const Department = require('../../models/department.model');
const ClassManagement = require('../../models/classManagement.model');
const ProfessionalTeam = require('../../models/professionalTeam.model');
const GenerateAccount = require('../../models/generate-account.model');

//[GET] /home
module.exports.index = async (req, res) => {
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
    res.render("client/pages/home/index.pug", {
      pageTitle: "Trang chủ"
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể vào trang chủ");
    res.redirect("back");
  }
}