const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const teacherSchema = new mongoose.Schema({
  id: String,
  name: String,
  id_department: String,
  gender: Number,
  avatar: String,
  countryside: String,
  birthday: Date,
  salary: Number, //lương trên 1 buổi
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

const Teacher = mongoose.model("Teacher", teacherSchema, "teachers");

module.exports = Teacher;