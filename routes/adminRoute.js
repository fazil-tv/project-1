const express = require("express");
const adminRoute = express();
const adminController = require("../controllers/adminControllers");
const path = require('path');


adminRoute.set('view engine', 'ejs');
adminRoute.set('views', './views/admin');

adminRoute.get("/adminsign", (req, res) => {
    res.send("hi");
});



module.exports = adminRoute;