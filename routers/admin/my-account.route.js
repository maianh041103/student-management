const express = require('express');
const route = express.Router();
const controller = require('../../controllers/admin/my-account.controller');

const multer = require('multer');
const upload = multer();
const uploadToClound = require('../../middlerware/uploadToClound.middlerware');

route.get('/', controller.index);

route.get('/edit', controller.edit);

route.patch('/edit', upload.single('avatar'), uploadToClound.uploadClound, controller.editPATCH);

module.exports = route;