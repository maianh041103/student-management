const { systemConfig } = require('../../config/system');
const Department = require('../../models/department.model');
const Teacher = require('../../models/teacher.model');

//[GET] /admin/teacher
module.exports.index = async (req, res) => {
  const teachers = await Teacher.find({
    deleted: false
  });

  for (const teacher of teachers) {
    const department = await Department.findOne({
      deleted: false,
      _id: teacher.id_department
    });
    console.log(department);
    if (department)
      teacher.departmentName = department.name;
    else
      teacher.departmentName = "";
  }

  res.render("admin/pages/teacher/index.pug", {
    pageTitle: "Danh sách giảng viên",
    teachers: teachers
  });
}

//[GET] /admin/teacher/create
module.exports.create = async (req, res) => {
  const departments = await Department.find({
    deleted: false
  });

  res.render("admin/pages/teacher/create.pug", {
    pageTitle: "Thêm giảng viên",
    departments: departments
  })
}

//[POST] /admin/teacher/create
module.exports.createPOST = async (req, res) => {
  console.log(req.body);
  try {
    if (req.body.gender) {
      req.body.gender = parseInt(req.body.gender);
      req.body.salary = parseInt(req.body.salary);
    }
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.redirect(`${systemConfig.prefixAdmin}/teacher`);
  } catch (error) {
    console.log(error);
    res.redirect(`${systemConfig.prefixAdmin}/teacher`);
  }

}