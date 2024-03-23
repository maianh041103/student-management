const express = require('express');
const app = express();
const path = require("path");
const { systemConfig } = require('./config/system');
const bodyParser = require('body-parser')
const moment = require('moment');
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const methodOverride = require("method-override");

//Nhúng file env
require("dotenv").config();
const port = process.env.PORT;
//End nhúng file env

//Biến toàn cục
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.systemConfig = systemConfig;
app.locals.moment = moment;
//End biến toàn cục

//Connect database
const database = require('./config/database');
database.connect();
//End connect database

//Nhúng file public
app.use(express.static(`${__dirname}/public`));
//End nhúng file public

//Nhúng bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//End nhúng bodyParser

//Nhúng methodOverride
app.use(methodOverride('_method'))
//End nhúng methodOverride

//Nhúng express-flash
app.use(cookieParser('maianh20'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//End nhúng express-flash

//Nhúng route
const adminRoute = require('./routers/admin/index.route');
const clientRoute = require('./routers/client/index.route');
adminRoute(app);
clientRoute(app);
app.get("*", (req, res) => {
  res.render("admin/pages/404/index.pug", {
    pageTile: "Không tìm thấy kết quả"
  })
})
//End nhúng route

//Nhúng file pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
//End nhúng file pug

app.listen(port, () => {
  console.log("App listen on port : " + port);
})