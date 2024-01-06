const mongoose = require('mongoose');

const settingGeneralSchema = new mongoose.Schema({
  id: String,
  schoolName: String,
  scoreFactor: String,//1-9,2-8,3-7
  money: Number, //số tiền/1 tín
  deleted: Boolean,
  deletedAt: Date
})

const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralSchema, "settingGenerals");
module.exports = SettingGeneral;