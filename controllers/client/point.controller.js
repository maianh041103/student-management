const ClassRoom = require("../../models/classRoom.model");
const Course = require("../../models/course.model");

const calcHelper = require("../../helpers/calc.helper");
//[GET] /point
module.exports.index = async (req, res) => {
  try {
    const userId = res.locals.user.info._id;
    const listClassRoom = await ClassRoom.find({
      deleted: false,
      "listStudent.id_student": userId
    });
    let result = [];
    for (const classRoom of listClassRoom) {
      let item = {
        _id: classRoom._id,
        name: classRoom.name.substring(0, 5),
        semester: classRoom.semester,
        year: classRoom.year,
      };

      const student = classRoom.listStudent.find(item => {
        return item.id_student == userId;
      })
      item.pointProcess = student.pointProcess;
      item.pointTest = student.pointTest;

      if (item.pointProcess && item.pointTest) {
        item.point10 = calcHelper.calcPoint10(item.pointProcess, item.pointTest);
        item.point4 = parseInt(calcHelper.calcPoint4(item.point10)) || "";
      }

      if (item.point4) {
        if (item.point4 < 1) {
          item.pointChar = "F";
        } else if (item.point4 < 1.5) {
          item.pointChar = "D";
        } else if (item.point4 < 2) {
          item.pointChar = "D+";
        } else if (item.point4 < 2.5) {
          item.pointChar = "C";
        } else if (item.point4 < 3) {
          item.pointChar = "C+";
        } else if (item.point4 < 3.5) {
          item.pointChar = "B";
        } else if (item.point4 < 4) {
          item.pointChar = "B+";
        } else {
          item.pointChar = "A";
        }
      } else {
        item.pointChar = "";
      }

      const course = await Course.findOne({
        _id: classRoom.id_course,
        deleted: false
      });
      if (course) {
        item.courseName = course.name;
        item.credit = course.credits;
        result.push(item);
      }
    }

    res.render("client/pages/point/index.pug", {
      pageTitle: "Kết qủa học tập",
      result: result
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể xem kết quả học tập");
    res.redirect("back");
  }
}