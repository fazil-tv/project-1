//  Require modules
const express = require("express");
const adminRoute = express();

// Require admin Controllers
const adminController = require("../controllers/adminControllers");


adminRoute.set('view engine', 'ejs');
adminRoute.set('views','./views/admin')


adminRoute.get("/login",adminController.signup);
adminRoute.post('/login',adminController.adminverifyLogin);

adminRoute.get("/users",adminController.loadUser);
adminRoute.get("/index",adminController.loaddashbord);


// adminRoute.get("/product",adminController.AddProduct);
adminRoute.put('/blockUser', adminController.blockUser);
adminRoute.put('/unblockUser', adminController.unblockUser);

//users
adminRoute.get('/users',adminController.users);
//product
adminRoute.get('/product',adminController.Product);



module.exports = adminRoute;