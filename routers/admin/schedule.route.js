const express = require("express");
const route = express.Router();
const controller = require("../../controllers/admin/schedule.controller");

route.get("/", controller.index);

route.get("/detail/:idClassManagement", controller.detail);

route.get("/edit/:idClassManagement", controller.edit);

route.patch("/edit/:idClassManagement", controller.editPATCH);

module.exports = route;