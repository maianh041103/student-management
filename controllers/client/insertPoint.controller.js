const ClassRoom = require('../../models/classRoom.model');
const Course = require('../../models/course.model');
const Student = require('../../models/student.model');

const getListYearHelper = require('../../helpers/getListYear');
const calcHelper = require('../../helpers/calc.helper');

//[GET] /insertPoint?year=?&semester=?
module.exports.index = async (req, res) => {
  try {
    let listYear = getListYearHelper.getListYear();
    let year = req.query.year || "";
    let semester = req.query.semester || "";

    let condition = {
      deleted: false,
      id_teacher: res.locals.user.info._id
    }
    if (year != "") {
      condition.year = year;
    }
    if (semester != "") {
      condition.semester = semester;
    }

    const listClassRoom = await ClassRoom.find(condition);
    for (const classRoom of listClassRoom) {
      const course = await Course.findOne({
        _id: classRoom.id_course,
        deleted: false
      });
      if (course) {
        classRoom.courseName = course.name;
      } else {
        classRoom.courseName = "";
      }
    }

    res.render("client/pages/insertPoint/index.pug", {
      pageTitle: "Danh sách lớp dạy học",
      listClassRoom: listClassRoom,
      listYear: listYear,
      yearSeleted: year,
      semesterSelected: semester
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể vào trang nhập điểm");
    res.redirect("back");
  }
}

//[GET] /insertPoint/detail/:idClassRoom?year=?&semester=?
module.exports.detail = async (req, res) => {
  try {
    const classRoom = await ClassRoom.findOne({
      _id: req.params.idClassRoom,
      deleted: false
    });

    let listStudent = [];
    if (classRoom) {
      //Tên môn học
      const course = await Course.findOne({
        _id: classRoom.id_course,
        deleted: false
      });

      classRoom.courseName = course.name;
      for (const student of classRoom.listStudent) {
        let studentInfo = await Student.findOne({
          deleted: false,
          _id: student.id_student
        });

        if (studentInfo) {
          studentInfo.pointProcess = student.pointProcess || "";
          studentInfo.pointTest = student.pointTest || "";
          if (student.pointProcess && student.pointTest) {
            const point10 = calcHelper.calcPoint10(student.pointProcess, student.pointTest);
            const point4 = calcHelper.calcPoint4(point10);
            studentInfo.point10 = point10;
            studentInfo.point4 = point4;
          }
        }
        listStudent.push(studentInfo);
      }
    }

    res.render("client/pages/insertPoint/detail.pug", {
      pageTitle: "Chi tiết bảng điểm",
      classRoom: classRoom,
      listStudent: listStudent,
      yearSeleted: req.query.year,
      semesterSelected: req.query.semester
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể xem chi tiết bảng điểm");
    res.redirect("back");
  }
}

//[GET] /insertPoint/edit/:idClassRoom?year=?&semester=?
module.exports.edit = async (req, res) => {
  try {
    const classRoom = await ClassRoom.findOne({
      _id: req.params.idClassRoom,
      deleted: false
    });

    let listStudent = [];
    if (classRoom) {
      //Tên môn học
      const course = await Course.findOne({
        _id: classRoom.id_course,
        deleted: false
      });

      classRoom.courseName = course.name;
      for (const student of classRoom.listStudent) {
        let studentInfo = await Student.findOne({
          deleted: false,
          _id: student.id_student
        });

        if (studentInfo) {
          studentInfo.pointProcess = student.pointProcess || "";
          studentInfo.pointTest = student.pointTest || "";
          if (student.pointProcess && student.pointTest) {
            const point10 = calcHelper.calcPoint10(student.pointProcess, student.pointTest);
            const point4 = calcHelper.calcPoint4(point10);
            studentInfo.point10 = point10;
            studentInfo.point4 = point4;
            studentInfo.id = student.id_student || "";
          }
        }

        listStudent.push(studentInfo);
      }
    }

    res.render("client/pages/insertPoint/edit.pug", {
      pageTitle: "Nhập điểm sinh viên",
      classRoom: classRoom,
      listStudent: listStudent,
      yearSeleted: req.query.year,
      semesterSelected: req.query.semester
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể vào trang nhập điểm");
    res.redirect("back");
  }
}

//[PATCH] /insertPoint/edit/:idClassRoom
module.exports.editPATCH = async (req, res) => {
  try {
    const result = req.body;
    let listStudent = [];
    for (let i = 0; i < result.studentId.length; i++) {
      let student = {
        id_student: result.studentId[i],
        pointProcess: parseFloat(result.pointProcess[i]),
        pointTest: parseFloat(result.pointTest[i])
      }
      listStudent.push(student);
    }
    await ClassRoom.updateOne({
      _id: req.params.idClassRoom,
      deleted: false
    }, {
      listStudent: listStudent
    });
    req.flash("Cập nhật điểm cho sinh viên thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể thay đổi điểm cho lớp học phần này");
    res.redirect("back");
  }
}

//[PATCH] /insertPoint/lock/:idClassRoom
module.exports.lock = async (req, res) => {
  try {
    check = true;
    const classRoom = await ClassRoom.findOne({
      _id: req.params.idClassRoom,
      deleted: false
    });
    if (classRoom) {
      const listStudent = classRoom.listStudent;
      listStudent.forEach(item => {
        if (!item.pointProcess || !item.pointTest) {
          check = false;
        }
      })
    }
    await ClassRoom.updateOne({
      _id: req.params.idClassRoom,
      deleted: false
    }, {
      status: "inactive"
    });

    if (check) {
      res.json({
        code: 200,
        message: "Thành công"
      })
    } else {
      res.json({
        code: 400,
        message: "Thất bại"
      })
    }
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Thất bại"
    })
  }
}