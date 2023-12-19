const express = require("express");
const adminRoute = express();
const adminController = require("../controllers/adminControllers");
const path = require('path');


adminRoute.set('view engine', 'ejs');
adminRoute.set('views', './views/admin');


adminRoute.get("/sign", (req, res) => {
    res.render("login");
});



module.exports = adminRoute;