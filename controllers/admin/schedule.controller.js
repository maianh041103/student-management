const Schedule = require('../../models/schedule.model');
const ClassRoom = require("../../models/classRoom.model");
const ClassManagement = require("../../models/classManagement.model");
const Course = require('../../models/course.model');

const { systemConfig } = require("../../config/system");
const scheduleHelper = require("../../helpers/schedule.helper");

//[GET] /admin/schedule/
module.exports.index = async (req, res) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  let listYear = [];
  for (let i = 0; i <= 10; i++) {
    listYear.push(`${currentYear - i}-${currentYear - i + 1}`);
  }

  const yearSeleted = req.query.year || "";
  const semesterSelected = req.query.semester || "";

  let data = [];

  if (yearSeleted != "" && semesterSelected != "") {
    const classManagements = await ClassManagement.find({
      deleted: false
    });

    for (const classManagement of classManagements) {
      if (currentYear - parseInt(classManagement.yearStart.split("-")[0]) < 8) {
        //Dem so mon da xep vao lich
        const regex = new RegExp(classManagement.name, 'i');
        const classRooms = await ClassRoom.find({
          name: { $regex: regex },
          semester: parseInt(semesterSelected),
          year: yearSeleted
        })

        let count = 0;
        for (const classRoom of classRooms) {
          const scheduleExists = await Schedule.findOne({
            deleted: false,
            id_classRoom: classRoom._id
          });
          if (scheduleExists) count++;
        }
        classManagement.count = count;
        classManagement.maxCount = classRooms.length;
        data.push(classManagement);
      }
    }
  }

  res.render("admin/pages/schedule/index.pug", {
    pageTitle: "Danh sách thời khóa biểu",
    listYear: listYear,
    yearSeleted: yearSeleted,
    semesterSelected: semesterSelected,
    data: data
  })
}

//[GET] /admin/schedule/detail/:idClassManagement?year=&semester=
module.exports.detail = async (req, res) => {
  try {
    const idClassManagement = req.params.idClassManagement;
    const yearSeleted = req.query.year || "";
    const semesterSelected = req.query.semester || "";

    const classManagement = await ClassManagement.findOne({
      _id: idClassManagement,
      deleted: false
    });

    const regex = new RegExp(classManagement.name, 'i');

    const classRooms = await ClassRoom.find({
      name: { $regex: regex },
      semester: parseInt(semesterSelected),
      year: yearSeleted
    })

    let listClassRoomId = [];
    for (const classRoom of classRooms) {
      listClassRoomId.push(classRoom._id);
    }

    let listSchedule = await Schedule.find({
      id_classRoom: { $in: listClassRoomId }
    })

    //Lấy ra list các lớp học phần sắp xếp theo thứ tự
    let listClassRoomResult = {}
    for (let time = 1; time <= 4; time++) {
      for (let date = 2; date <= 7; date++) {
        const idClassRoom = scheduleHelper.getIdClassRoom(listSchedule, date, time);
        if (idClassRoom) {
          const classRoom = await ClassRoom.findOne({
            _id: idClassRoom
          });
          const course = await Course.findOne({
            _id: classRoom.id_course
          });
          listClassRoomResult[`${time}-${date}`] = course.name;
        } else {
          listClassRoomResult[`${time}-${date}`] = "";
        }
      }
    }
    //End lấy ra list các lớp học phần sắp xếp theo thứ tự

    res.render("admin/pages/schedule/detail.pug", {
      pageTitle: "Chi tiết lịch học",
      classManagement: classManagement,
      classRooms: classRooms,
      year: yearSeleted,
      semester: semesterSelected,
      listClassRoomResult: listClassRoomResult
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể tìm thấy lịch học cho lớp quản lý này");
    res.redirect("back");
  }
}

//[GET] /admin/schedule/edit/:idClassManagement?year=&semester=
module.exports.edit = async (req, res) => {
  try {
    const idClassManagement = req.params.idClassManagement;
    const yearSeleted = req.query.year || "";
    const semesterSelected = req.query.semester || "";

    const classManagement = await ClassManagement.findOne({
      _id: idClassManagement,
      deleted: false
    });

    const regex = new RegExp(classManagement.name, 'i');

    const classRooms = await ClassRoom.find({
      name: { $regex: regex },
      semester: parseInt(semesterSelected),
      year: yearSeleted,
      //Giảng viên chưa dạy vào ca này
    })

    let listClassRoomId = [];
    for (const classRoom of classRooms) {
      listClassRoomId.push(classRoom._id);

      const course = await Course.findOne({
        _id: classRoom.id_course
      });
      classRoom.courseName = course.name;
    }

    let listSchedule = await Schedule.find({
      id_classRoom: { $in: listClassRoomId }
    })

    //Lấy ra list các lớp học phần sắp xếp theo thứ tự
    let listClassRoomResult = {}
    for (let time = 1; time <= 4; time++) {
      for (let date = 2; date <= 7; date++) {
        const idClassRoom = scheduleHelper.getIdClassRoom(listSchedule, date, time);
        listClassRoomResult[`${time}-${date}`] = idClassRoom;
      }
    }
    //End lấy ra list các lớp học phần sắp xếp theo thứ tự

    res.render("admin/pages/schedule/edit.pug", {
      pageTitle: "Chỉnh sửa lịch học",
      classManagement: classManagement,
      classRooms: classRooms,
      year: yearSeleted,
      semester: semesterSelected,
      listClassRoomResult: listClassRoomResult
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể tìm thấy lịch học cho lớp quản lý này");
    res.redirect("back");
  }
}

//[PATCH] /admin/schedule/edit/:idClassManagement
module.exports.editPATCH = async (req, res) => {
  try {
    //Xóa các lớp học phần
    const idClassManagement = req.params.idClassManagement;
    const yearSeleted = req.query.year || "";
    const semesterSelected = req.query.semester || "";

    const classManagement = await ClassManagement.findOne({
      _id: idClassManagement,
      deleted: false
    });

    const regex = new RegExp(classManagement.name, 'i');

    const classRooms = await ClassRoom.find({
      name: { $regex: regex },
      semester: parseInt(semesterSelected),
      year: yearSeleted
    })

    let listClassRoomId = [];
    for (const classRoom of classRooms) {
      listClassRoomId.push(classRoom._id);
    }

    await Schedule.deleteMany({
      id_classRoom: { $in: listClassRoomId }
    })
    //End xóa các lớp học phần

    const data = req.body;
    const scheduleMap = scheduleHelper.getMapSchedule(data);
    for (let [key, value] of scheduleMap) {
      const schedule = {
        id_classRoom: key,
        schedule: value,
      }
      const newRecord = new Schedule(schedule);
      await newRecord.save();
    }

    res.json({
      code: 200,
      message: "Xếp lịch học thành công"
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Xếp lịch học thất bại"
    })
  }
}