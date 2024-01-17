const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  id: String,
  name: String,
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

const Room = mongoose.model("Room", roomSchema, "rooms");

module.exports = Room;