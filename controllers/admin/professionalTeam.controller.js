const ProfessionalTeam = require("../../models/professionalTeam.model");
const Teacher = require("../../models/teacher.model");
const Course = require("../../models/course.model");

const { systemConfig } = require("../../config/system");

//[GET] /admin/professionalTeam/
module.exports.index = async (req, res) => {
  const professionalTeams = await ProfessionalTeam.find({
    deleted: false
  })
  for (const professionalTeam of professionalTeams) {
    const teacher = await Teacher.findOne({
      deleted: false,
      _id: professionalTeam.id_teacher
    });
    if (teacher) {
      professionalTeam.teacherName = teacher.name;
    }
  }
  res.render("admin/pages/professionalTeam/index", {
    professionalTeams: professionalTeams,
    pageTitle: "Danh sách tổ chuyên môn"
  })
}

//[GET] /admin/professionalTeam/create
module.exports.create = async (req, res) => {
  const teachers = await Teacher.find({
    deleted: false,
    id_professionalTeam: null
  });

  res.render("admin/pages/professionalTeam/create", {
    pageTitle: "Thêm mới tổ chuyên môn",
    teachers: teachers
  });
}

//[POST] /admin/professionalTeam/create
module.exports.createPOST = async (req, res) => {
  try {
    const record = new ProfessionalTeam(req.body);
    await record.save();
    await Teacher.updateOne({
      _id: req.body.id_teacher
    }, {
      id_professionalTeam: record._id
    });
    req.flash("success", "Thêm mới tổ chuyên môn thành công");
    res.redirect(`${systemConfig.prefixAdmin}/professionalTeam`);
  } catch (error) {
    req.flash("error", "Thêm mới tổ chuyên môn thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/professionalTeam`);
  }
}

//[GET] /admin/professionalTeam/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const professionalTeam = await ProfessionalTeam.findOne({
      deleted: false,
      _id: req.params.id
    });

    const teachers = await Teacher.find({
      deleted: false,
      id_professionalTeam: professionalTeam._id
    });

    const courses = await Course.find({
      deleted: false,
      id_professionalTeam: professionalTeam._id
    });

    res.render("admin/pages/professionalTeam/detail.pug", {
      pageTitle: "Chi tiết bộ môn",
      professionalTeam: professionalTeam,
      teachers: teachers,
      courses: courses
    });

  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy bộ môn");
    res.render("back");
  }
}

//[GET] /admin/professionalTeam/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const professionalTeam = await ProfessionalTeam.findOne({
      _id: req.params.id,
      deleted: false
    });

    const teachers = await Teacher.find({
      deleted: false,
      $or: [{
        id_professionalTeam: null
      }, {
        id_professionalTeam: professionalTeam._id
      }]
    });

    const teacherOfProfessionalTeam = await Teacher.find({
      deleted: false,
      id_professionalTeam: professionalTeam._id
    });

    const courses = await Course.find({
      deleted: false,
      id_professionalTeam: professionalTeam._id
    });

    res.render("admin/pages/professionalTeam/edit", {
      pageTitle: "Chỉnh sửa thông tin bộ môn",
      professionalTeam: professionalTeam,
      teachers: teachers,
      teacherOfProfessionalTeam: teacherOfProfessionalTeam,
      courses: courses
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy tổ bộ môn");
    res.redirect("back");
  }
}

//[GET] /admin/professionalTeam/insertTeacher/:id
module.exports.insertTeacher = async (req, res) => {
  try {
    const teachers = await Teacher.find({
      deleted: false,
      $or: [{
        id_professionalTeam: null
      }, {
        id_professionalTeam: req.params.id
      }]
    });

    res.render("admin/pages/professionalTeam/insertTeacher", {
      pageTitle: "Thêm giảng viên",
      professionalTeamId: req.params.id,
      teachers: teachers
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Lỗi khi in ra danh sách giảng viên");
    res.redirect("back");
  }
}

//[POST] /admin/professionalTeam/insertTeacher/:id
module.exports.insertTeacherPOST = async (req, res) => {
  try {
    
    const dataTeacherId = req.body.id_teacher || []
    let listTeacherId = [];
    if (typeof dataTeacherId == "string") {
      listTeacherId.push(dataTeacherId);
    } else {
      listTeacherId = dataTeacherId;
    }
    const teacher = 
    console.log(listTeacherId);
    // req.flash("success", "Thêm sinh viên vào lớp học phần thành công");
    // res.redirect(`${systemConfig.prefixAdmin}/classRoom/edit/${req.params.id}`);

    res.send("OK");
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm sinh viên vào lớp học phần thất bại");
    res.redirect("back");
  }
}