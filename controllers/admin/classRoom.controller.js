const ClassRoom = require('../../models/classRoom.model');
const Teacher = require('../../models/teacher.model');
const Course = require('../../models/course.model');
const Student = require('../../models/student.model');
const ClassManagement = require('../../models/classManagement.model');
const Department = require('../../models/department.model');

const { systemConfig } = require('../../config/system');
const calcHelper = require('../../helpers/calc.helper');

//[GET] /admin/classRoom/
module.exports.index = async (req, res) => {
  try {
    const classRooms = await ClassRoom.find({
      deleted: false
    });
    for (const classRoom of classRooms) {
      const teacher = await Teacher.findOne({
        deleted: false,
        _id: classRoom.id_teacher
      });
      classRoom.teacherName = teacher.name;
      const course = await Course.findOne({
        deleted: false,
        _id: classRoom.id_course
      });
      classRoom.courseName = course.name;
    }
    res.render("admin/pages/classRoom/index.pug", {
      pageTitle: "Danh sách lớp học phần",
      classRooms: classRooms
    });
  } catch (error) {
    console.log(error);
    req.flash("Không thể mở danh sách lớp học phần");
    res.redirect(back);
  }
}

//[GET] /admin/classRoom/create
module.exports.create = async (req, res) => {
  const courses = await Course.find({
    deleted: false
  });
  const teachers = await Teacher.find({
    deleted: false
  });
  res.render("admin/pages/classRoom/create.pug", {
    pageTitle: "Thêm mới lớp học phần",
    courses: courses,
    teachers: teachers
  })
}

//[POST] /admin/classRoom/create
module.exports.createPOST = async (req, res) => {
  try {
    req.body.quantity = parseInt(req.body.quantity);
    const newClassRoom = new ClassRoom(req.body);
    await newClassRoom.save();
    req.flash("success", "Thêm mới lớp học phần thành công");
    res.redirect(`${systemConfig.prefixAdmin}/classRoom`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm lớp học phần thất bại");
    res.redirect("back");
  }
}

//[GET] /admin/classRoom/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const classRoom = await ClassRoom.findOne({
      _id: req.params.id,
      deleted: false
    });
    const teacher = await Teacher.findOne({
      _id: classRoom.id_teacher,
      deleted: false
    });
    classRoom.teacherName = teacher.name;
    const course = await Course.findOne({
      _id: classRoom.id_course,
      deleted: false
    });
    classRoom.courseName = course.name;

    //Lấy thông tin sinh viên
    let listStudent = [];
    for (const element of classRoom.listStudent) {
      const student = await Student.findOne({
        _id: element.id,
        deleted: false
      });
      const classManagement = await ClassManagement.findOne({
        deleted: false,
        _id: student.id_classManagement
      });
      if (classManagement) {
        student.classManagementName = classManagement.name;
      }
      student.pointProcess = element.pointProcess;
      student.pointTest = element.pointTest;
      student.point10 = calcHelper.calcPoint10(element.pointProcess, element.pointTest);
      student.point4 = calcHelper.calcPoint10(student.point10);
      listStudent.push(student);
    }
    //End lấy thông tin sinh viên

    res.render("admin/pages/classRoom/detail.pug", {
      pageTitle: "Chi tiết lớp học phần",
      classRoom: classRoom,
      listStudent: listStudent
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy lớp học phần");
    res.redirect("back");
  }
}

//[GET] /admin/classRoom/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const classRoom = await ClassRoom.findOne({
      _id: req.params.id,
      deleted: false
    });

    const teachers = await Teacher.find({
      deleted: false,
      status: "active"
    });

    const courses = await Course.find({
      deleted: false,
      status: "active"
    });

    let listStudentId = [];
    for (const element of classRoom.listStudent) {
      listStudentId.push(element.id_student);
    }

    let listStudent = [];
    for (const id of listStudentId) {
      const student = await Student.findOne({
        _id: id,
        deleted: false
      });
      listStudent.push(student);
    }

    res.render("admin/pages/classRoom/edit", {
      pageTitle: "Chỉnh sửa lớp học phần",
      classRoom: classRoom,
      teachers: teachers,
      courses: courses,
      listStudent: listStudent
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy lớp học phần");
    res.redirect("back");
  }
}

//[PATCH] /admin/classRoom/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    req.body.quantity = parseInt(req.body.quantity);
    await ClassRoom.updateOne({
      _id: req.params.id,
      deleted: false
    }, req.body);
    req.flash("success", "Chỉnh sửa thông tin lớp học phần thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Chỉnh sửa thông tin lớp học phần thất bại");
    res.redirect("back");
  }
}

//[GET] /admin/classRoom/indertStudent/:id
module.exports.insertStudent = async (req, res) => {
  try {
    const classRoom = await ClassRoom.findOne({
      _id: req.params.id,
      deleted: false
    });

    let listStudentId = [];
    for (const element of classRoom.listStudent) {
      listStudentId.push(element.id_student);
    }

    const listStudent = await Student.find({
      deleted: false,
      _id: { $nin: listStudentId }
    })

    for (const student of listStudent) {
      const department = await Department.findOne({
        _id: student.id_student,
        deleted: false
      });
      if (department)
        student.departmentName = department.name;
    }

    res.render("admin/pages/classRoom/insertStudent", {
      pageTitle: "Thêm sinh viên vào lớp học phần",
      listStudent: listStudent,
      classRoomId: req.params.id
    })

  } catch (error) {
    console.log(error);
    req.flash("Không thể vào trang thêm sinh viên");
    res.redirect("back");
  }
}

//[POST] /admin/classRoom/insertStudent/:id
module.exports.insertStudentPOST = async (req, res) => {
  try {
    const dataStudentId = req.body.id_student || []
    let listStudentId = [];
    if (typeof dataStudentId == "string") {
      listStudentId.push(dataStudentId);
    } else {
      listStudentId = dataStudentId;
    }
    let listStudent = [];
    for (const id of listStudentId) {
      listStudent.push({
        id_student: id
      })
    }
    if (listStudentId.length == 0) {
      req.flash("error", "Vui lòng thêm ít nhất 1 sinh viên");
      res.redirect("back");
      return;
    }

    //Kiểm tra còn đủ chỗ không
    const classRoomInsert = await ClassRoom.findOne({
      deleted: false,
      _id: req.params.id
    });
    if (classRoomInsert.listStudent.length + listStudentId.length > classRoomInsert.quantity) {
      req.flash("error", "Lớp học phần không còn đủ chỗ trống");
      res.redirect(`${systemConfig.prefixAdmin}/classRoom/edit/${req.params.id}`);
      return;
    }
    //End kiểm tra còn đủ chỗ không
    await ClassRoom.updateOne({
      _id: req.params.id
    },
      {
        listStudent: listStudent
      });
    req.flash("success", "Thêm sinh viên vào lớp học phần thành công");
    res.redirect(`${systemConfig.prefixAdmin}/classRoom/edit/${req.params.id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm sinh viên vào lớp học phần thất bại");
    res.redirect("back");
  }
}

//[DELETE] /admin/classRoom/remove/:classId/:studentId
module.exports.removeStudent = async (req, res) => {
  try {
    await ClassRoom.updateOne({
      _id: req.params.classId,
      $pull: { listStudent: { id_student: req.params.studentId } }
    });
    req.flash("success", "Xóa sinh viên khỏi lớp học phần thành công");
    res.json({
      code: 200,
      message: "Thành công"
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Xóa sinh viên khỏi lớp học phần thất bại");
    res.json({
      code: 400,
      message: "Thất bại"
    });
  }
}

//[PATCH] /admin/classRoom/changeStatus
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.query.id;
    let status = req.query.status;
    if (status == "active") {
      status = "complete";
    } else if (status == "cancel") {
      status = "active"
    } else {
      status = "cancel"
    }
    await ClassRoom.updateOne({
      _id: id
    }, {
      status: status
    });
    req.flash("success", "Cập nhật trạng thái thành công");
    res.json({
      code: 200,
      messsage: "Cập nhật trạng thái thành công"
    });
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại");
    res.json({
      code: 400,
      message: "Cập nhật trạng thái thất bại"
    });
  }
}

//[DELETE] /admin/classRoom/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await ClassRoom.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date
    });
    req.flash("success", "Xóa lớp học phần thành công");
    res.json({
      code: 200,
      message: "Xóa thành công"
    })
  } catch (error) {
    req.flash("error", "Xóa lớp học phần thất bại");
    res.json({
      code: 400,
      message: "Xóa thất bại"
    });
  }
}
