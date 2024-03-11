const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const professionalTeamSchema = new mongoose.Schema({
  id: String,
  name: String,
  id_teacher: String,
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
});

const ProfessionalTeam = mongoose.model("ProfessionalTeam", professionalTeamSchema, "professionalTeams");

module.exports = ProfessionalTeam;

