//  Require modules
const express = require("express");
const adminRoute = express();

// Require  Controllers
const adminController = require("../controllers/adminController");
const productController = require('../controllers/productController')
const categoryController = require('../controllers/categoryController');

const multer = require("../middlewares/multer");
const auth = require('../middlewares/authAdmin')


adminRoute.set('view engine', 'ejs');
adminRoute.set('views','./views/admin')


adminRoute.get("/login",auth.isLogout,adminController.signup);
adminRoute.post('/login',auth.isLogout,adminController.adminverifyLogin);

adminRoute.get("/users",auth.isLogin,adminController.loadUser);
adminRoute.get("/index",auth.isLogin,adminController.loaddashbord);

adminRoute.get('/logout',adminController.logout);

// adminRoute.get("/product",adminController.AddProduct);
adminRoute.put('/blockUser',auth.isLogin, adminController.blockUser);
adminRoute.put('/unblockUser',auth.isLogin, adminController.unblockUser);

//users
adminRoute.get('/users',auth.isLogin,adminController.users);
//product
adminRoute.get('/product',auth.isLogin,productController.Product);
//addproduct
adminRoute.get('/addproduct',auth.isLogin,productController.addproduct);
// adminRoute.post('/addproduct',multer.uploadProduct,productController.addProductspost);
adminRoute.post('/addproduct',auth.isLogin, multer.uploadProduct, productController.addProductspost);

// edit product
// adminRoute.get('/editproduct',productController.editproduct);
adminRoute.get('/editproduct', productController.editProduct);
adminRoute.post('/editproduct', multer.uploadProduct, productController.editProductpost);

//category
adminRoute.get('/category',auth.isLogin,categoryController.category);
//addcategory
adminRoute.get('/addcategory',auth.isLogin,categoryController.addcategory);
adminRoute.post('/addcategory',auth.isLogin,categoryController.addCategoryPost);

//edit category
adminRoute.put('/editcategory/:categoryId',auth.isLogin, categoryController.editcategory);
//block category and unblock
adminRoute.put('/blockCategory',auth.isLogin, categoryController.blockCategory);
adminRoute.put('/unblockCategory',auth.isLogin,categoryController.unblockCategory);
//block product
adminRoute.put('/blockProduct/:id',auth.isLogin,productController.blockProduct);


module.exports = adminRoute;