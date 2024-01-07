const express = require("express");
const route = express.Router();
const controller = require('../../controllers/admin/teacher.controller');
const multer = require('multer');
const upload = multer();
const uploadToClound = require('../../middlerware/uploadToClound.middlerware');

route.get("/", controller.index);

route.get('/create', controller.create);

route.post('/create', upload.single("avatar"), uploadToClound.uploadClound, controller.createPOST);

module.exports = route;