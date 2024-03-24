const Schedule = require('../../models/schedule.model');
const ClassRoom = require('../../models/classRoom.model');
const Course = require('../../models/course.model');
const Teacher = require('../../models/teacher.model');
const ClassManagement = require('../../models/classManagement.model');
const Room = require('../../models/room.model');

//[GET] /schedule
module.exports.index = async (req, res) => {
  try {
    const userId = res.locals.user.info._id;
    let listClassRoom;
    if (res.locals.user.type == "student") {
      listClassRoom = await ClassRoom.find({
        deleted: false,
        'listStudent.id_student': userId
      });
    }
    else {
      listClassRoom = await ClassRoom.find({
        id_teacher: userId,
        deleted: false
      });
    }

    let listClassRoomId = listClassRoom.map(item => {
      return item._id;
    });

    const listSchedule = await Schedule.find({
      deleted: false,
      id_classRoom: { $in: listClassRoomId }
    });

    for (const schedule of listSchedule) {
      const classRoom = await ClassRoom.findOne({
        deleted: false,
        _id: schedule.id_classRoom
      });
      if (classRoom) {
        const course = await Course.findOne({
          deleted: false,
          _id: classRoom.id_course
        });

        const teacher = await Teacher.findOne({
          deleted: false,
          _id: classRoom.id_teacher
        });

        const classManagement = await ClassManagement.findOne({
          deleted: false,
          name: classRoom.name.substring(0, 5)
        });

        if (classManagement) {
          const room = await Room.findOne({
            deleted: false,
            _id: classManagement.id_room
          });
          schedule.roomName = room ? room.name : "";
        }

        schedule.classRoomName = classRoom ? classRoom.name : "";
        schedule.courseName = course ? course.name : "";
        schedule.teacherName = teacher ? teacher.name : "";
      }
    }

    res.render("client/pages/schedule/index.pug", {
      pageTitle: "Thời khóa biểu",
      schedules: listSchedule
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy thời khóa biểu");
    res.redirect("back");
  }
}