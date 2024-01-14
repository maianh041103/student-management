const Course = require('../models/course.model');

module.exports.calcCredits = async (programFrame) => {
  let sum = 0;
  for (const id of programFrame.id_course) {
    const course = await Course.findOne({
      _id: id,
      deleted: false
    });
    if (course) {
      sum += course.credits
    }
  }
  return sum;
}