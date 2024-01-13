const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const ClassRoomSchema = new mongoose.Schema({
  id: String,
  name: String,
  id_teacher: String,
  id_subject: String,
  stock: Number, //vị trí còn trống
  score: Number, // điểm trung bình
  listStudent: [{
    id_student: String,
    pointProcess: Number, //điểm qt
    pointTest: Number //điểm ck
  }],
  status: String,
  deleted: Boolean,
  deletedAt: Date,
  createdBy: {
    accId: String,
    createdAt: Date
  },
  updatedBy: {
    accId: String,
    updatedAt: Date
  },
  deletedBy: {
    accId: String,
    deletedAt: Date
  },
  slug: {
    type: String,
    slug: "name",
    unique: true
  }
})

const ClassRoom = mongoose.model("ClassRoom", ClassRoomSchema, "classRooms");

module.exports = ClassRoom;