const express = require("express");
const adminRoute = express();
const adminController = require("../controllers/adminControllers");


adminRoute.set('view engine', 'ejs');
adminRoute.set('views','./views/admin')


adminRoute.get("/login",adminController.signup);
adminRoute.post('/login',adminController.adminverifyLogin);

// adminRoute.post('/',adminController.adminverifyLogin);



module.exports = adminRoute;