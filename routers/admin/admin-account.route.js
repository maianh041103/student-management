const express = require('express');
const route = express.Router();
const controller = require('../../controllers/admin/admin-account.controller');

const multer = require('multer');
const upload = multer();
const uploadToClound = require('../../middlerware/uploadToClound.middlerware');

route.get("/", controller.index);

route.get("/detail/:id", controller.detail);

route.get("/edit/:id", controller.edit);

route.patch("/edit/:id", upload.single('avatar'), uploadToClound.uploadClound, controller.editPATCH);

route.patch("/changeStatus", controller.changeStatus);

route.delete("/delete/:id", controller.deleteItem);

module.exports = route;