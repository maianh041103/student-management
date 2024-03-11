const Schedule = require('../../models/schedule.model');
const ClassRoom = require("../../models/classRoom.model");

//[GET] /admin/schedule/
module.exports.index = async (req, res) => {
  const listClassRoom = await ClassRoom.find({
    deleted: false
  });
  let data = [];
  for (const classRoom of listClassRoom) {
    let dataClassRoom = {
      id: classRoom._id,
      name: classRoom.name
    }
    const schedule = await Schedule.findOne({
      deleted: false,
      id_classRoom: classRoom._id
    });
    if (schedule) {
      dataClassRoom["status"] = schedule.status;
      dataClassRoom["_id"] = schedule._id;
    }
    else {
      dataClassRoom["status"] = schedule ? "complete" : "progress";
    }
    data.push(dataClassRoom);

  }
  console.log(data);
  res.render("admin/pages/schedule/index.pug", {
    pageTitle: "Danh sách thời khóa biểu",
    data: data
  })
}