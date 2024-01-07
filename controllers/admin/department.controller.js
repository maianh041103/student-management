const { systemConfig } = require('../../config/system');
const Department = require('../../models/department.model');
const Teacher = require('../../models/teacher.model');

//[GET] /admin/department/
module.exports.index = async (req, res) => {
  const departments = await Department.find({
    deleted: false
  });

  for (const department of departments) {
    const teacher = await Teacher.findOne({
      deleted: false,
      _id: department.id_teacher
    });

    if (teacher)
      department.teacherName = teacher.name;
    else
      department.teacherName = "";
  }

  res.render("admin/pages/department/index.pug", {
    pageTitle: "Khoa",
    departments: departments
  })
}

//[GET] /admin/department/create
module.exports.create = async (req, res) => {
  const teachers = await Teacher.find({
    deleted: false
  }).select("id name");

  res.render("admin/pages/department/create.pug", {
    pageTitle: "Tạo khoa",
    teachers: teachers
  })
}

//[POST] /admin/department/create
module.exports.createPOST = async (req, res) => {
  try {
    console.log(req.body);
    const newDepartment = new Department(req.body);
    await newDepartment.save();
    req.flash("success", "Thêm khoa thành công");
    res.redirect(`${systemConfig.prefixAdmin}/department`);
  } catch (error) {
    req.flash("error", "Thêm khoa thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/department`);
  }
}