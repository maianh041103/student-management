const express = require('express');
const route = express.Router();

const controller = require('../../controllers/client/insertPoint.controller');

route.get("/", controller.index);

route.get("/detail/:idClassRoom", controller.detail);

route.get("/edit/:idClassRoom", controller.edit);

route.patch("/edit/:idClassRoom", controller.editPATCH);

route.patch("/lock/:idClassRoom", controller.lock);

module.exports = route;