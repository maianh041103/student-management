module.exports.getListYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  let listYear = [];
  for (let i = 0; i <= 10; i++) {
    listYear.push(`${currentYear - i}-${currentYear - i + 1}`);
  }
  return listYear;
}