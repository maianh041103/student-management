const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin('slug');

const studentSchema = new mongoose.Schema({
  id: String,
  name: String,
  studentCode: String,
  gender: Number,
  countryside: String,
  birthday: Date,
  avatar: String,
  course: Number, //Khoá học
  id_classManagement: String,
  gpa: Number,
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
});

const Student = mongoose.model("Student", studentSchema, "students");

module.exports = Student;