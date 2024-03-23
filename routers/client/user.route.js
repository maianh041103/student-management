const express = require('express');
const route = express.Router();

const controller = require('../../controllers/client/user.controller');
const multer = require('multer');
const upload = multer();
const uploadToClound = require('../../middlerware/uploadToClound.middlerware');

route.get("/info", controller.info);

route.get("/edit", controller.edit);

route.patch("/edit", upload.single('avatar'), uploadToClound.uploadClound, controller.editPATCH);

route.get("/changePassword", controller.changePassword);

route.patch("/changePassword", controller.changePasswordPATCH);

module.exports = route;