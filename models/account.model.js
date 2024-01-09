const mongoose = require('mongoose');
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const accountSchema = new mongoose.Schema({
  id: String,
  email: String,
  password: String,
  token: String,
  fullName: String,
  avatar: String,
  role_id: String,
  phone: String,
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
    slug: "fullName",
    unique: true
  }
})

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;