const express = require('express');
const route = express.Router();
const controller = require('../../controllers/client/schedule.controller');

route.get("/", controller.index);

module.exports = route;