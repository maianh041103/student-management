const uploadImageToClound = require('../helpers/uploadImagesToClound.helper');

module.exports.uploadClound = async (req, res, next) => {
  if (req.file) {
    const link = await uploadImageToClound(req.file.buffer);
    req.body[req.file.fieldname] = link;
  }
  next();
}