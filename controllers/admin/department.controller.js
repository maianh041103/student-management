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

//[GET] /admin/department/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const department = await Department.findOne({
      _id: req.params.id,
      deleted: false
    });

    const teacher = await Teacher.findOne({
      _id: department.id_teacher,
      deleted: false
    });
    if (teacher) {
      department.teacherName = teacher.name;
    }

    const teachers = await Teacher.find({
      deleted: false,
      id_department: req.params.id
    });

    res.render("admin/pages/department/detail.pug", {
      pageTitle: 'Chi tiết khoa',
      department: department,
      teachers: teachers
    })
  } catch (error) {
    req.flash("Không tìm thấy khoa");
    res.redirect("back");
  }
}

//[GET] /admin/department/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const department = await Department.findOne({
      deleted: false,
      _id: req.params.id
    });

    const teachers = await Teacher.find({
      deleted: false
    });

    res.render("admin/pages/department/edit.pug", {
      pageTitle: "Sửa thông tin khoa",
      department: department,
      teachers: teachers
    })
  } catch (error) {
    req.flash("error", "Không tìm thấy khoa");
    res.redirect("back");
  }
}

//[PACTH] /admin/department/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    await Department.updateOne({
      _id: req.params.id
    }, req.body);
    req.flash("success", "Sửa thông tin khoa thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Sửa thông tin khoa thất bại");
    res.redirect("back");
  }
}

//[PATCH] /admin/department/changeStatus
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.query.id;
    let status = req.query.status;
    newStatus = (status == "active" ? "inactive" : "active");
    await Department.updateOne({
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

//[DELETE] /admin/department/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Department.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date
    });
    req.flash("success", "Xóa khoa thành công");
    res.json({
      code: 200,
      message: "Xóa thành công"
    })
  } catch (error) {
    req.flash("error", "Xóa khoa thất bại");
    res.json({
      code: 400,
      message: "Xóa thất bại"
    });
  }
}

