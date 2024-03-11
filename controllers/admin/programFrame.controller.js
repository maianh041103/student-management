const ProgramFrame = require('../../models/programFrame.model');
const Department = require('../../models/department.model');
const Course = require('../../models/course.model');

const calcHelper = require('../../helpers/calc.helper');
const { systemConfig } = require('../../config/system');

//[GET] /admin/programFrame
module.exports.index = async (req, res) => {
  const programFrames = await ProgramFrame.find({
    deleted: false
  });

  for (const programFrame of programFrames) {
    programFrame.totalCredits = await calcHelper.calcCredits(programFrame);
    const department = await Department.findOne({
      deleted: false,
      _id: programFrame.id_department
    });
    if (department) {
      programFrame.departmentName = department.name;
    }
  }
  res.render("admin/pages/programFrame/index.pug", {
    pageTitle: "Chương trình khung",
    programFrames: programFrames
  });
}

//[GET] /admin/programFrame/create
module.exports.create = async (req, res) => {
  const departments = await Department.find({
    deleted: false
  });

  const listCourse = await Course.find({
    deleted: false,
    status: "active"
  });

  res.render("admin/pages/programFrame/create.pug", {
    pageTitle: "Thêm mới chương trình khung",
    departments: departments,
    listCourse: listCourse
  })
}

//[GET] /admin/programFrame/create/getData?departmentId=?&semester=?
module.exports.createGetData = async (req, res) => {
  try {
    const departmentId = req.query.departmentId;
    const semester = req.query.semester;
    const programFrameExists = await ProgramFrame.findOne({
      id_department: departmentId,
      semester: semester
    });

    const listCourse = await Course.find({
      deleted: false,
      status: "active"
    });

    if (programFrameExists) {
      res.json({
        code: 200,
        status: "exists",
        listCourseSelected: programFrameExists.id_course,
        listCourse: listCourse
      })
    } else {
      const listProgramFrameByDepartmentId = await ProgramFrame.find({
        id_department: departmentId
      });

      listCourses = [];
      for (const programFrame of listProgramFrameByDepartmentId) {
        listCourseTmp = programFrame.id_course;
        listCourseTmp.forEach(item => {
          listCourses.push(item);
        })
      }

      res.json({
        code: 200,
        status: "none",
        listCourseSelected: listCourses,
        listCourse: listCourse
      })
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Error"
    })
  }
}

//[POST] /admin/programFrame/createPOST
module.exports.createPOST = async (req, res) => {
  try {
    req.body.semester = parseInt(req.body.semester);
    const programFrameExists = await ProgramFrame.findOne({
      id_department: req.body.id_department,
      semester: req.body.semester,
      deleted: false
    });
    if (programFrameExists) {
      await ProgramFrame.updateOne({
        id_department: req.body.id_department,
        semester: req.body.semester,
      }, req.body);
      req.flash("success", "Cập nhật mới chương trình khung thành công");
    }
    else {
      const newProgramFrame = await ProgramFrame(req.body);
      await newProgramFrame.save();
      req.flash("success", "Thêm chương trình khung thành công");
    }
    res.redirect(`${systemConfig.prefixAdmin}/programFrame`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm chương trình khung thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/programFrame`);
  }
}

//[GET] /admin/programFrame/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const programFrame = await ProgramFrame.findOne({
      deleted: false,
      _id: req.params.id
    });

    const department = await Department.findOne({
      _id: programFrame.id_department,
      deleted: false
    });
    if (department) {
      programFrame.departmentName = department.name
    }

    const listCourse = [];
    for (const id of programFrame.id_course) {
      const course = await Course.findOne({
        deleted: false,
        _id: id
      });
      listCourse.push(course)
    }
    res.render("admin/pages/programFrame/detail", {
      pageTitle: "Chi tiết chương trình khung",
      programFrame: programFrame,
      listCourse: listCourse
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy chương trình khung")
    res.redirect("back");
  }
}

//[GET] /admin/programFrame/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const programFrame = await ProgramFrame.findOne({
      _id: req.params.id,
      deleted: false
    });

    const departmentId = programFrame.id_department;

    const department = await Department.findOne({
      _id: departmentId
    });

    const programFramesExists = await ProgramFrame.find({
      id_department: departmentId,
      semester: { $ne: programFrame.semester }
    });

    listCourseExists = [];
    for (const programFrame of programFramesExists) {
      const courses = programFrame.id_course;
      courses.forEach(item => {
        listCourseExists.push(item);
      })
    }

    const listCourse = await Course.find({
      deleted: false,
      status: "active",
      _id: { $nin: listCourseExists }
    });

    res.render("admin/pages/programFrame/edit.pug", {
      pageTitle: "Sửa chương trình khung",
      programFrame: programFrame,
      listCourse: listCourse,
      department: department,

    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy chương trình khung");
    res.redirect("back");
  }
}

//[PATCH] /admin/programFrame/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    const programFrameExists = await ProgramFrame.findOne({
      semester: req.body.semester,
      id_department: req.body.id_department
    });
    if (programFrameExists) {
      req.flash("error", "Chương trình khung này đã tồn tại");
      res.redirect("back");
      return;
    }
    await ProgramFrame.updateOne({
      _id: req.params.id
    }, req.body);
    req.flash("success", "Chỉnh sửa chương trình khung thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Chỉnh sửa thông tin chương trình khung thành công");
    res.render("back");
  }
}

//[PATCH] /admin/programFrame/changeStatus
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.query.id;
    let status = req.query.status;
    newStatus = (status == "active" ? "inactive" : "active");
    await ProgramFrame.updateOne({
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

//[DELETE] /admin/programFrame/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await ProgramFrame.updateOne({
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