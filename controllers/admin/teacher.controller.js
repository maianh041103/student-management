const { systemConfig } = require('../../config/system');
const Department = require('../../models/department.model');
const Teacher = require('../../models/teacher.model');

const generateHelper = require('../../helpers/generate.helper');
const GenerateAccount = require('../../models/generate-account.model');

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
  try {
    if (req.body.gender) {
      req.body.gender = parseInt(req.body.gender);
    }
    if (req.body.salary) {
      req.body.salary = parseInt(req.body.salary);
    }
    req.body.teacherCode = generateHelper.generateRandomNumber(7);
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();

    //Tự động sinh tài khoản
    const dataGenerateAccount = {
      email: generateHelper.generateEmail(newTeacher.name, newTeacher.teacherCode),
      password: generateHelper.generatePassword(newTeacher.birthday),
      token: generateHelper.generateRandomString(20),
      type: "teacher",
      code: req.body.teacherCode
    }

    const newAccount = new GenerateAccount(dataGenerateAccount);
    await newAccount.save();
    //End tự động sinh tài khoản
    req.flash("success", "Thêm giáo viên thành công");
    res.redirect(`${systemConfig.prefixAdmin}/teacher`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm giáo viên thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/teacher`);
  }
}

//[GET] /admin/teacher/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = await Teacher.findOne({
      _id: id,
      deleted: false
    });
    const department = await Department.findOne({
      deleted: false,
      _id: teacher.id_department
    });
    teacher.departmentName = department.name;

    res.render("admin/pages/teacher/detail.pug", {
      pageTitle: "Thông tin chi tiết giảng viên",
      teacher: teacher
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy giảng viên");
    res.redirect("back");
  }
}

//[GET] /admin/teacher/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = await Teacher.findOne({
      _id: id,
      deleted: false
    });

    const departments = await Department.find({
      deleted: false
    });

    res.render("admin/pages/teacher/edit.pug", {
      pageTitle: "Chỉnh sửa thông tin giảng viên",
      teacher: teacher,
      departments: departments
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy giảng viên");
    res.redirect("back");
  }

}

//[PATCH] /admin/teacher/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    if (req.body.gender) {
      req.body.gender = parseInt(req.body.gender);
    }
    if (req.body.birthday == '') {
      delete req.body.birthday;
    }
    if (req.body.salary) {
      req.body.salary = parseInt(req.body.salary);
    }
    await Teacher.updateOne({
      _id: req.params.id
    }, req.body);
    req.flash("success", "Cập nhật thông tin giảng viên thành công");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Cập nhật thông tin giảng viên thất bại");
    res.redirect("back");
  }
}

//[PATCH] /admin/teacher/changeStatus?id=...&status=...
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.query.id;
    let status = req.query.status;
    status = (status == "inactive" ? "active" : "inactive");
    await Teacher.updateOne({
      _id: id
    }, {
      status: status
    });
    req.flash("success", "Cập nhật trạng thái giảng viên thành công");
    res.json({
      code: 200,
      messsage: "Cập nhật trạng thái thành công"
    });
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái giảng viên thất bại");
    res.json({
      code: 400,
      message: "Cập nhật trạng thái thất bại"
    });
  }
}

//[DELETE] /admin/teacher/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = await Teacher.findOne({
      _id: id
    });
    await Teacher.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date()
    });

    await GenerateAccount.updateOne({
      code: teacher.teacherCode
    }, {
      deleted: true,
      deletedAt: new Date()
    })
    req.flash("success", "Xóa giảng viên thành công");
    res.json({
      code: 200,
      message: "Thành công"
    });
  } catch (error) {
    req.flash("error", "Xóa giảng viên thất bại");
    res.json({
      code: 400,
      message: "Thất bại"
    });
  }
}