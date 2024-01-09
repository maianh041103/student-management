const mongoose = require('mongoose');
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const generateAccountSchema = new mongoose.Schema({
  id: String,
  email: String,
  password: String,
  token: String,
  type: String,
  code: String,
  status: {
    type: String,
    default: "active"
  },
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
    slug: "email",
    unique: true
  }
})

const GenerateAccount = mongoose.model("GenerateAccount", generateAccountSchema, "generateAccounts");

module.exports = GenerateAccount;