const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  id: String,
  id_classRoom: String,
  schedule: [
    {
      time: Number, // ca học : 1 2 3
      date: Number, //thứ 2 3 4
    }
  ],
  // status: String, //progress, complete
  deleted: {
    type: Boolean,
    default: false
  },
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