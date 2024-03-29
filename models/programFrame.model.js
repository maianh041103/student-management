const mongoose = require("mongoose");

const programFrameSchema = new mongoose.Schema({
  id: String,
  id_department: String,
  semester: Number,
  id_course: Array,
  status: String,
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

const ProgramFrame = mongoose.model("ProgramFrame", programFrameSchema, 'programFrames');

module.exports = ProgramFrame;