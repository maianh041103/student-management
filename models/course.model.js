const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const courseSchema = new mongoose.Schema({
  id: String,
  name: String,
  credits: Number, //Số tín chỉ
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

const Course = mongoose.model("Course", courseSchema, courses);