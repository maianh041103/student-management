const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: String,
  description: String,
  permissions: {
    type: Array,
    default: []
  },
  status: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: new Date()
    }
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date
  },
  updatedBy: [{
    account_id: String,
    updatedAt: Date
  }]
},
  { timestamps: true }
)

const Role = mongoose.model('Role', roleSchema, 'roles');

module.exports = Role;  