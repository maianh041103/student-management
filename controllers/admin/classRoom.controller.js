const ClassRoom = require('../../models/classRoom.model');
const Teacher = require('../../models/teacher.model');
const Course = require('../../models/course.model');
const Student = require('../../models/student.model');
const ClassManagement = require('../../models/classManagement.model');
const Department = require('../../models/department.model');
const ProgramFrame = require('../../models/programFrame.model');

const { systemConfig } = require('../../config/system');
const calcHelper = require('../../helpers/calc.helper');
const generateYearHelper = require('../../helpers/generate.year.helper');

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
      classRoom.teacherName = teacher?.name || "";
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
    res.redirect("back");
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
    var currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    // T9->12: HK1 T1->T5: HK2 T6->T8 : HK3 
    let semester;
    let strYear;
    if (month >= 9 && month <= 12) {
      semester = 1;
      strYear = `${year}-${year + 1}`;
    } else if (month >= 1 && month <= 5) {
      semester = 2;
      strYear = `${year - 1}-${year}`
    } else {
      semester = 3;
      strYear = `${year - 1}-${year}`
    }
    req.body.semester = semester;
    req.body.year = strYear;
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

//[GET] /admin/classRoom/generate
module.exports.generate = async (req, res) => {
  try {
    const classManagements = await ClassManagement.find({
      deleted: false,
      status: "active"
    });

    let semester;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    for (const classManagement of classManagements) {
      if (currentMonth >= 9) {
        semester = 1;
      } else if (currentMonth >= 6) {
        semester = 3;
      } else {
        semester = 2;
      }

      const yearStr = classManagement.yearStart;
      let year;
      if (currentMonth >= 9) {
        year = yearStr.substring(0, 4);
      }
      else {
        year = yearStr.substring(5, 9);
      }
      semester += (currentYear - year) * 3;
      classManagement.semester = semester;
    }

    res.render("admin/pages/classRoom/generate.pug", {
      pageTitle: "Sinh lớp học phần",
      classManagements: classManagements
    })

  } catch (error) {
    req.flash("Lỗi trong quá trình tìm lớp");
    res.redirect("back");
  }
}

//[POST] /admin/classRoom/generatePOST
module.exports.generatePOST = async (req, res) => {
  try {
    const dataResult = JSON.parse(req.body.listClassManagement);
    for (const item of dataResult) {
      const classManagement = await ClassManagement.findOne({
        deleted: false,
        _id: item.split("-")[0]
      });
      const semester = parseInt(item.split("-")[1]);
      const programFrame = await ProgramFrame.findOne({
        id_department: classManagement.id_department,
        semester: semester
      });
      let year;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      const month = currentDate.getMonth() + 1;

      let semesterClassRoom;
      if (month >= 9 && month <= 12) {
        semesterClassRoom = 1;
        year = `${currentYear}-${currentYear + 1}`;
      } else if (month >= 1 && month <= 5) {
        semesterClassRoom = 2;
        year = `${currentYear - 1}-${currentYear}`
      } else {
        semesemesterClassRoomster = 3;
        year = `${currentYear - 1}-${currentYear}`
      }

      const listIdCourse = programFrame.id_course;

      const listStudent = await Student.find({
        id_classManagement: item.split("-")[0],
        deleted: false
      });

      const listStudentId = listStudent.map(student => {
        return {
          id_student: student._id
        }
      })

      for (const idCourse of listIdCourse) {
        const classRoomObject = {
          name: `${classManagement.name}-${idCourse}`,
          id_course: idCourse,
          quantity: 50,
          listStudent: listStudentId,
          semester: semesterClassRoom,
          year: year,
          status: "active"
        }

        const newClassRoom = ClassRoom(classRoomObject);
        await newClassRoom.save();
      }
    }
    req.flash("success", "Generate lớp học phần thành công");
    res.redirect(`${systemConfig.prefixAdmin}/classRoom`);
  } catch (error) {
    req.flash("Lỗi trong quá trình generate lớp học phần");
    req.redirect("back");
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
    classRoom.teacherName = teacher?.name || "";
    const course = await Course.findOne({
      _id: classRoom.id_course,
      deleted: false
    });
    classRoom.courseName = course.name;

    //Lấy thông tin sinh viên
    let listStudent = [];
    for (const element of classRoom.listStudent) {
      const student = await Student.findOne({
        _id: element.id_student,
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
      student.point4 = calcHelper.calcPoint4(student.point10);
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

    const point = classRoom.listStudent;

    let listStudentId = [];
    for (const element of classRoom.listStudent) {
      listStudentId.push(element.id_student);
    }

    let listStudent = [];
    for (let i = 0; i < listStudentId.length; i++) {
      const student = await Student.findOne({
        _id: listStudentId[i],
        deleted: false
      });
      point[i].point10 = calcHelper.calcPoint10(point[i].pointProcess || 0, point[i].pointTest || 0);
      point[i].point4 = calcHelper.calcPoint4(point[i].point10 || 0);
      student.dataPoint = point[i];
      const classManagement = await ClassManagement.findOne({
        _id: student.id_classManagement,
        deleted: false
      });
      if (classManagement) {
        student.classManagementName = classManagement.name;
      }
      listStudent.push(student);
    }
    const listYear = generateYearHelper.generateYear();

    res.render("admin/pages/classRoom/edit", {
      pageTitle: "Chỉnh sửa lớp học phần",
      classRoom: classRoom,
      teachers: teachers,
      courses: courses,
      listStudent: listStudent,
      listYear: listYear
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
    req.body.semester = parseInt(req.body.semester);
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
    let listClassIgnore = [];
    const classRoom = await ClassRoom.findOne({
      _id: req.params.id,
      deleted: false
    });
    listClassIgnore.push(classRoom);

    const listClassRoomActive = await ClassRoom.find({
      id_course: classRoom.id_course,
      status: "active"
    });
    listClassRoomActive.forEach(e => {
      listClassIgnore.push(e);
    });

    const listClassRoomComplete = await ClassRoom.find({
      id_course: classRoom.id_course,
      status: "complete"
    });

    let listStudentId = [];  //Danh sách sinh viên bỏ qua
    for (const classRoom of listClassIgnore) {
      for (const element of classRoom.listStudent) {
        listStudentId.push(element.id_student);
      }
    }

    for (const classRoom of listClassRoomComplete) {
      for (const element of classRoom.listStudent) {
        const point = calcHelper.calcPoint10(element.pointProcess, element.pointTest);
        if (point >= 5.5) {
          listStudentId.push(element.id_student);
        }
      }
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
        $push: { listStudent: listStudent }
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

//[PATCH] /admin/classRoom/edit/:classId/:studentId
module.exports.editStudent = async (req, res) => {
  try {
    const classId = req.params.classId;
    const studentId = req.params.studentId;
    const data = req.body;

    await ClassRoom.updateOne({
      _id: classId,
      'listStudent.id_student': studentId
    },
      {
        $set: {
          'listStudent.$.pointProcess': parseInt(data.pointProcess),
          'listStudent.$.pointTest': parseInt(data.pointTest)
        }
      })
    res.json({
      code: 200,
      message: "Thành công"
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Chỉnh sửa thông tin sinh viên trong lớp học phần thất bại");
    res.json({
      code: 400,
      message: "Thất bại"
    })
  }
}

//[PATCH] /admin/classRoom/save/:classId
module.exports.saveStudent = async (req, res) => {
  try {
    const classId = req.params.classId;
    const listPointProcess = req.body.listPointProcess;
    const listPointTest = req.body.listPointTest;
    const listStudentId = req.body.listStudentId;

    let listStudent = [];
    for (let i = 0; i < listStudentId.length; i++) {
      let student = {
        id_student: listStudentId[i]
      }
      if (listPointProcess[i]) {
        student.pointProcess = parseFloat(listPointProcess[i]);
      }
      if (listPointTest[i]) {
        student.pointTest = parseFloat(listPointTest[i]);
      }
      listStudent.push(student);
    }

    await ClassRoom.updateOne({
      _id: classId,
    }, {
      listStudent: listStudent
    })

    res.json({
      code: 200,
      message: "Thành công"
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Chỉnh sửa thông tin sinh viên trong lớp học phần thất bại");
    res.json({
      code: 400,
      message: "Thất bại"
    })
  }
}