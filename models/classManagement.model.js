const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const classManagementSchema = new mongoose.Schema({
  id: String,
  name: String,
  id_teacher: String,
  id_department: String, //id khoa
  yearStart: String,
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

const ClassManagement = mongoose.model("ClassManagement", classManagementSchema, "classManagements");

module.exports = ClassManagement;

