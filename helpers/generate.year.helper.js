module.exports.generateYear = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let listYear = [];
  for (let i = -1; i <= 8; i++) {
    let tmp = `${year - i - 1}-${year - i}`;
    listYear.push(tmp);
  }
  return listYear;
}