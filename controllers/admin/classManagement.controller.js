const ClassManagement = require('../../models/classManagement.model');
const Department = require('../../models/department.model');
const Teacher = require('../../models/teacher.model');
const Student = require('../../models/student.model');
const Room = require('../../models/room.model');

const { systemConfig } = require('../../config/system');
const calcHelper = require('../../helpers/calc.helper');

//[GET] /admin/classManagement
module.exports.index = async (req, res) => {
  const classManagements = await ClassManagement.find({
    deleted: false
  });

  for (const classManagement of classManagements) {
    const department = await Department.findOne({
      deleted: false,
      _id: classManagement.id_department
    });
    if (department) {
      classManagement.departmentName = department.name;
    }

    const teacher = await Teacher.findOne({
      deleted: false,
      _id: classManagement.id_teacher
    });
    if (teacher) {
      classManagement.teacherName = teacher.name;
    }

    const listStudent = await Student.find({
      deleted: false,
      id_classManagement: classManagement._id
    });

    classManagement.listStudent = listStudent;

    const room = await Room.findOne({
      _id: classManagement.id_room
    });
    if (room) {
      classManagement.roomName = room.name;
    }
  }

  res.render("admin/pages/classManagement/index.pug", {
    pageTitle: "Danh sách lớp quản lý",
    classManagements: classManagements
  });
}

//[GET] /admin/classManagement/create
module.exports.create = async (req, res) => {
  const departments = await Department.find({
    deleted: false
  });

  const teachers = await Teacher.find({
    deleted: false
  });

  const classManagements = await ClassManagement.find({
    deleted: false
  });

  let listRoomId = [];
  classManagements.forEach(item => {
    listRoomId.push(item.id_room);
  });

  const rooms = await Room.find({
    deleted: false,
    _id: { $nin: listRoomId }
  });

  res.render("admin/pages/classManagement/create", {
    pageTitle: "Thêm lớp quản lý",
    departments: departments,
    teachers: teachers,
    rooms: rooms
  })
}

//[POST] /admin/classManagement/crete
module.exports.createPOST = async (req, res) => {
  try {
    if (!req.body.yearStart) {
      var currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      // T9->12: HK1 T1->T5: HK2 T6->T8 : HK3 
      if (month >= 9) {
        req.body.yearStart = `${year}-${year + 1}`;
      } else {
        req.body.yearStart = `${year - 1}-${year}`;
      }
    }
    const newClass = new ClassManagement(req.body);
    await newClass.save();
    req.flash("Thêm mới lớp quản lý thành công");
    res.redirect(`${systemConfig.prefixAdmin}/classManagement`);
  } catch (error) {
    console.log(error);
    req.flash("Thêm mới lớp quản lý thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/classManagement`);
  }
}

//[GET] /admin/classManagement/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const classManagement = await ClassManagement.findOne({
      deleted: false,
      _id: req.params.id
    });

    const department = await Department.findOne({
      deleted: false,
      _id: classManagement.id_department
    });
    classManagement.departmentName = department.name;

    const teacher = await Teacher.findOne({
      deleted: false,
      _id: classManagement.id_teacher
    });
    classManagement.teacherName = teacher.name;

    const room = await Room.findOne({
      deleted: false,
      _id: classManagement.id_room
    });
    classManagement.roomName = room.name;

    const listStudent = await Student.find({
      id_classManagement: classManagement._id,
      deleted: false
    });

    for (const student of listStudent) {
      student.totalCredits = await calcHelper.calcTotalCredits(student._id);
    }

    res.render("admin/pages/classManagement/detail.pug", {
      pageTitle: "Chi tiết lớp quản lý",
      listStudent: listStudent,
      classManagement: classManagement
    })

  } catch (error) {
    console.log(error);
    req.flash("error", "Xem thông tin chi tiết lớp quản lý thất bại");
    res.render(`${systemConfig.prefixAdmin}/classManagement`);
  }
}

//[GET] /admin/classManagement/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const classManagement = await ClassManagement.findOne({
      deleted: false,
      _id: req.params.id
    });

    const departments = await Department.find({
      deleted: false,
      status: "active"
    });

    const teachers = await Teacher.find({
      deleted: false,
      status: "active"
    });

    const classManagements = await ClassManagement.find({
      deleted:false
    });
    let listRoomId = [];
    classManagements.forEach(item => {
      listRoomId.push(item.id_room);
    });
    const rooms = await Room.find({
      deleted: false,
      _id: { $nin: listRoomId }
    });

    const listStudent = await Student.find({
      id_classManagement: classManagement._id,
      deleted: false
    });

    res.render("admin/pages/classManagement/edit.pug", {
      pageTitle: "Chỉnh sửa thông tin lớp quản lý",
      classManagement: classManagement,
      departments: departments,
      teachers: teachers,
      rooms: rooms,
      listStudent: listStudent
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy lớp quản lý");
    res.redirect("back");
  }
}

//[PATCH] /admin/classManagement/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    await ClassManagement.updateOne({
      _id: req.params.id
    }, req.body);
    req.flash("success", "Chỉnh sửa thông tin lớp quản lý thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Chỉnh sửa thông tin lớp quản lý thất bại");
    res.redirect("back");
  }
}

//[GET] /admin/classManagement/insertStudent/:id
module.exports.insert = async (req, res) => {
  try {
    const listStudent = await Student.find({
      deleted: false,
      id_classManagement: null
    })

    res.render("admin/pages/classManagement/insertStudent", {
      pageTitle: "Thêm sinh viên vào lớp quản lý",
      listStudent: listStudent,
      classManagementId: req.params.id
    })

  } catch (error) {
    console.log(error);
    req.flash("Không thể vào trang thêm sinh viên");
    res.redirect("back");
  }
}

//[POST] /admin/classManagement/insertStudent/:id
module.exports.insertStudentPOST = async (req, res) => {
  try {
    const dataStudentId = req.body.id_student || []
    let listStudentId = [];
    if (typeof dataStudentId == "string") {
      listStudentId.push(dataStudentId);
    } else {
      listStudentId = dataStudentId;
    }

    if (listStudentId.length == 0) {
      req.flash("error", "Vui lòng thêm ít nhất 1 sinh viên");
      res.redirect("back");
      return;
    }

    for (const studentId of listStudentId) {
      await Student.updateOne({
        _id: studentId
      }, {
        id_classManagement: req.params.id
      });
    }

    req.flash("success", "Thêm sinh viên vào lớp quản lý thành công");
    res.redirect(`${systemConfig.prefixAdmin}/classManagement/edit/${req.params.id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm sinh viên vào lớp quản lý thất bại");
    res.redirect("back");
  }
}

//[DELETE] /admin/classManagement/remove/:classId/:studentId
module.exports.removeStudent = async (req, res) => {
  try {
    await Student.updateOne({
      _id: req.params.studentId
    }, {
      id_classManagement: null
    })
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

//[PATCH] /admin/classManagement/changeStatus
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
    await ClassManagement.updateOne({
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

//[DELETE] /admin/classManagement/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await ClassManagement.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date
    });
    req.flash("success", "Xóa lớp quản lý thành công");
    res.json({
      code: 200,
      message: "Xóa thành công"
    })
  } catch (error) {
    req.flash("error", "Xóa lớp quản lý thất bại");
    res.json({
      code: 400,
      message: "Xóa thất bại"
    });
  }
}
