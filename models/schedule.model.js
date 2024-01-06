const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  id: String,
  time: Number, // ca học : 1 2 3
  id_classRoom: String,
  room: String,
  id_teacher: Array,
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
  }
});

const Schedule = mongoose.model("Schedule", scheduleSchema, "schedules");

module.exports = Schedule;