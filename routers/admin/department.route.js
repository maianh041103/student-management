const express = require('express');
const route = express.Router();

const controller = require('../../controllers/admin/department.controller');

route.get("/", controller.index);

route.get("/create", controller.create);

route.post("/create", controller.createPOST);

route.get("/detail/:id", controller.detail);

route.get("/edit/:id", controller.edit);

route.patch("/edit/:id", controller.editPATCH);

route.patch("/changeStatus/department", controller.changeStatus);

route.delete("/delete/department/:id", controller.deleteItem);

module.exports = route;