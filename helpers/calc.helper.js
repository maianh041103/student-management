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

module.exports.calcPoint10 = async (pointProcess, pointTest) => {
  return Math.round((pointProcess * 0.3 + pointTest * 0.7) * 100) / 100;
}

module.exports.calcPoint4 = async (point10) => {
  if (point10 < 4) {
    return 0;
  }
  if (point10 < 5) {
    return 1;
  }
  if (point10 < 5.5) {
    return 1.5;
  }
  if (point10 < 6.5) {
    return 2;
  }
  if (point10 < 7) {
    return 2.5;
  }
  if (point10 < 8) {
    return 3;
  }
  if (point10 < 8.5) {
    return 3.5;
  }
  return 4;
}