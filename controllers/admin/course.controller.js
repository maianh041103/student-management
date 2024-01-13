const Course = require('../../models/course.model');
const { systemConfig } = require('../../config/system');

//[GET] /admin/course
module.exports.index = async (req, res) => {
  const courses = await Course.find({
    deleted: false
  });
  res.render("admin/pages/course/index.pug", {
    pageTitle: "Danh sách môn học",
    courses: courses
  });
}

//[GET] /admin/course/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/course/create.pug", {
    pageTitle: "Thêm môn học"
  });
}

//[POST] /admin/course/create
module.exports.createPOST = async (req, res) => {
  try {
    const data = new Course(req.body);
    await data.save();
    req.flash("success", "Thêm môn học thành công");
    res.redirect(`${systemConfig.prefixAdmin}/course`);
  } catch (error) {
    req.flash("error", "Thêm môn học thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/course`);
  }
}

//[GET] /admin/course/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      deleted: false
    });
    res.render("admin/pages/course/detail.pug", {
      pageTitle: "Chi tiết môn học",
      course: course
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy môn học");
    res.redirect(`${systemConfig.prefixAdmin}/course`);
  }
}

//[GET] /admin/course/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      deleted: false
    });
    res.render("admin/pages/course/edit.pug", {
      pageTitle: "Chỉnh sửa thông tin môn học",
      course: course
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy môn học");
    res.redirect(back);
  }
}

//[PACTH] /admin/course/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    await Course.updateOne({
      _id: req.params.id
    }, req.body);
    req.flash("success", "Chỉnh sửa thông tin môn học thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Chỉnh sửa thông tin môn học thất bại");
    res.redirect("back");
  }
}

//[PATCH] /admin/course/changeStatus
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.query.id;
    let status = req.query.status;
    newStatus = (status == "active" ? "inactive" : "active");
    await Course.updateOne({
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

//[DELETE] /admin/course/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Course.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date
    });
    req.flash("success", "Xóa môn học thành công");
    res.json({
      code: 200,
      message: "Xóa thành công"
    })
  } catch (error) {
    req.flash("error", "Xóa môn học thất bại");
    res.json({
      code: 400,
      message: "Xóa thất bại"
    });
  }
}
