const express = require("express");
const route = express.Router();
const controller = require("../../controllers/admin/professionalTeam.controller");

route.get("/", controller.index);

route.get("/create", controller.create);

route.post("/create", controller.createPOST);

route.get("/detail/:id", controller.detail);

route.get("/edit/:id", controller.edit);

route.get("/insertTeacher/:id", controller.insertTeacher);

route.post("/insertTeacher/:id", controller.insertTeacherPOST);

route.get("/insertCourse/:id", controller.insertCourse);

route.post("/insertCourse/:id", controller.insertCoursePOST);

module.exports = route;