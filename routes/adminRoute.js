//  Require modules
const express = require("express");
const adminRoute = express();

// Require  Controllers
const adminController = require("../controllers/adminController");
const productController = require('../controllers/productController')
const categoryController = require('../controllers/categoryController');


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
adminRoute.get('/product',productController.Product);
//addproduct
adminRoute.get('/addproduct',productController.addproduct);
//category
adminRoute.get('/category',categoryController.category);
//addcategory
adminRoute.get('/addcategory',categoryController.addcategory);
adminRoute.post('/addcategory',categoryController.addCategoryPost);
//
adminRoute.put('/blockCategory', categoryController.blockCategory);
adminRoute.put('/unblockCategory',categoryController.unblockCategory);



module.exports = adminRoute;