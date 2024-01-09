const moment = require("moment");

module.exports.generateRandomString = (length) => {
  const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += character[Math.floor(Math.random() * character.length)];
  }
  return result;
}

module.exports.generateRandomNumber = (length) => {
  const character = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += character[Math.floor(Math.random() * character.length)];
  }
  return result;
}

module.exports.generateEmail = (fullName, code) => {
  let nameArray = fullName.split(" ");
  let email = nameArray[nameArray.length - 1];
  email += code + "@gmail.com";
  return email;
}

module.exports.generatePassword = (date) => {
  let dateFormat = moment(date).format("DD/MM/YYYY")
  let password = dateFormat.split("/").join("");
  return password;
}