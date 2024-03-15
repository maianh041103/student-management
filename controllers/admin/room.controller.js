const Room = require("../../models/room.model")

const { systemConfig } = require("../../config/system");
const ClassManagement = require("../../models/classManagement.model");

//[GET] /admin/room/
module.exports.index = async (req, res) => {
  const rooms = await Room.find({
    deleted: false
  });

  for (const room of rooms) {
    const classManagement = await ClassManagement.findOne({
      id_room: room._id,
      deleted: false
    });
    if (classManagement)
      room.classManagementName = classManagement.name;
    else
      room.classManagementName = "";
  }

  res.render("admin/pages/room/index.pug", {
    pageTitle: "Danh sách phòng học",
    rooms: rooms
  })
}

//[GET] /admin/room/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/room/create.pug", {
    pageTitle: "Thêm mới phòng học"
  })
}

//[POST] /admin/room/create
module.exports.createPOST = async (req, res) => {
  try {
    const roomExists = await Room.findOne({
      name: req.body.name
    });
    if (roomExists) {
      req.flash("error", "Phòng học đã tồn tại");
      res.redirect("back");
      return;
    }
    const newRoom = new Room(req.body);
    await newRoom.save();
    req.flash("success", "Thêm mới phòng học thành công");
    res.redirect(`${systemConfig.prefixAdmin}/room`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm mới phòng học thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/room`);
  }
}

//[GET] /admin/room/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const room = await Room.findOne({
      deleted: false,
      _id: req.params.id
    });
    res.render("admin/pages/room/edit", {
      pageTitle: "Chỉnh sửa phòng học",
      room: room
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy phòng học");
    res.redirect("back");
  }
}

//[PATCH] /admin/room/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    const roomExists = await Room.findOne({
      deleted: false,
      name: req.body.data
    });
    if (roomExists) {
      req.flash("error", "Phòng học đã tồn tại");
      res.redirect("back");
      return;
    }
    await Room.updateOne({
      _id: req.params.id
    }, req.body);
    req.flash("success", "Chỉnh sửa thông tin phòng thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Chỉnh sửa thông tin phòng thất bại");
    res.redirect("back");
  }
}

//[PATCH] /admin/room/changeStatus
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.query.id;
    let status = req.query.status;
    newStatus = (status == "active" ? "inactive" : "active");
    await Room.updateOne({
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

//[DELETE] /admin/room/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Room.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date
    });
    req.flash("success", "Xóa phòng học thành công");
    res.json({
      code: 200,
      message: "Xóa thành công"
    })
  } catch (error) {
    req.flash("error", "Xóa phòng học thất bại");
    res.json({
      code: 400,
      message: "Xóa thất bại"
    });
  }
}
