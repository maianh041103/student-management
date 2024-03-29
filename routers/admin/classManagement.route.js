const express = require('express');
const route = express.Router();
const controller = require("../../controllers/admin/classManagement.controller");

route.get("/", controller.index);

route.get("/create", controller.create);

route.post("/create", controller.createPOST);

route.get("/detail/:id", controller.detail);

route.get("/edit/:id", controller.edit);

route.patch("/edit/:id", controller.editPATCH);

route.get("/insertStudent/:id", controller.insert);

route.post("/insertStudent/:id", controller.insertStudentPOST);

route.delete("/remove/:classId/:studentId", controller.removeStudent);

route.patch("/changeStatus", controller.changeStatus);

route.delete("/delete/:id", controller.deleteItem);

module.exports = route;