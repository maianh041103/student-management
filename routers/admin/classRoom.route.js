const express = require('express');
const route = express.Router();
const controller = require('../../controllers/admin/classRoom.controller');

route.get("/", controller.index);

route.get("/create", controller.create);

route.post("/create", controller.createPOST);

route.get("/generate", controller.generate);

route.post("/generate", controller.generatePOST);

route.get("/detail/:id", controller.detail);

route.get("/edit/:id", controller.edit);

route.patch("/edit/:id", controller.editPATCH);

route.get("/insertStudent/:id", controller.insertStudent);

route.post("/insertStudent/:id", controller.insertStudentPOST);

route.delete("/remove/:classId/:studentId", controller.removeStudent);

route.patch("/changeStatus", controller.changeStatus);

route.delete("/delete/:id", controller.deleteItem);

route.patch("/edit/:classId/:studentId", controller.editStudent);

route.patch("/save/:classId", controller.saveStudent);

module.exports = route;