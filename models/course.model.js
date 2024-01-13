const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const courseSchema = new mongoose.Schema({
  id: String,
  name: String,
  credits: Number, //Số tín chỉ
  theory: Number, //tiết lý thuyết
  practice: Number, //tiết thực hành
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
  },
  slug: {
    type: String,
    slug: "name",
    unique: true
  }
})

const Course = mongoose.model("Course", courseSchema, "courses");

module.exports = Course;