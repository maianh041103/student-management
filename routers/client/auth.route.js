const express = require('express');
const route = express.Router();
const controller = require('../../controllers/client/auth.controller');

route.get("/login", controller.login);

route.post("/login", controller.loginPOST);

route.get("/logout", controller.logout);

module.exports = route;