module.exports.getMapSchedule = (data) => {
  let result = new Map();
  for (const item of data) {
    let value = [];
    if (result.has(item.classRoomId)) {
      value = result.get(item.classRoomId);
    }
    value.push({
      time: item.time,
      date: item.date
    });
    result.set(item.classRoomId, value);
  }
  return result;
}

module.exports.getIdClassRoom = (listSchedule, date, time) => {
  for (const schedule of listSchedule) {
    for (const item of schedule.schedule) {
      if (item.date == date && item.time == time)
        return schedule.id_classRoom;
    }
  }
  return "";
}