//  Require modules
const express = require("express");
const userRoute = express();

// Require user Controllers
const userController = require("../controllers/userControllers");
const productController = require('../controllers/productController');
const User = require("../model/userSchema");
const addressController = require('../controllers/addressController');

const cartController = require('../controllers/cartController');

const checkoutController = require("../controllers/checkoutController");

const orderController = require('../controllers/orderController');

const userauth = require ('../middlewares/authUser');

userRoute.set('view engine', 'ejs')
userRoute.set('views', './views/user')


userRoute.get("/indexhome",userController.indexhome)


userRoute.get("/login",userauth.isLogout, (req, res) => {
    res.render("login");
})


userRoute.get("/otp", async (req, res) => {
    const userId = req.session.user_id
    console.log("kitty:",userId);
    const user = await User.findOne({_id:userId});
    const email = user.email;
    console.log("kitty:",email);
    res.render("otp", { userId ,email});

});
userRoute.post('/otp', userController.verifyPost)


userRoute.post('/resendotp', (req, res) => {
    const { email, userId } = req.body;
    console.log("nooop");
    console.log(userId);
    userController.resendmailUser(userId,res);
});



// SIGN-UP
userRoute.get("/signup",userauth.isLogout, userController.signup);
userRoute.post('/signup',userauth.isLogout, userController.insertUser);



// LOGIN
userRoute.post('/login',userauth.isLogout, userController .verifyLogin);
userRoute.post('/',userauth.isLogout, userController.verifyLogin);


//indexhome
userRoute.get("/indexhome", userController.indexhome);
userRoute.post('/indexhome', userController.indexhome);

//blog
userRoute.get("/blog", userController.blog);
userRoute.post('/blog', userController.blog);

//user logout
userRoute.get('/logout',userController.userLogout);



//singleproduct
userRoute.get("/singleproduct", userController.singleproduct);
userRoute.post('/singleproduct', userController.singleproduct);

//shop
userRoute.get("/shop", userController.shop);
userRoute.post('/shop', userController.shop);
//about
userRoute.get("/about", userController.about);
userRoute.post('/about', userController.about);
//useraccount
userRoute.get("/useraccount",userauth.isLogin, userController.useraccount);
// userRoute.post('/about', userController.about);

//resetpassword
userRoute.get("/resetpassword", userController.resetpassword);
userRoute.post('/resetpassword', userController.resetpassword);




//contact
userRoute.get("/contact", (req, res) => {
    res.render('contact')
})



// edit user
userRoute.post('/edituser', userController. edituser);


//reset password 
userRoute.put('/resetpassword', userController. resetpassword)


//adaddress 
userRoute.post('/adaddress', addressController. adaddress);

//editaddress
userRoute.patch('/editaddress', addressController.editaddress);

// deletaddress
userRoute.delete('/deletaddress', addressController.deletaddress);



//cart

userRoute.get('/cart', cartController.cart);

userRoute.post('/getcart', userauth.isLogin, cartController.getcart);

//remove cart
userRoute.post('/removecarts', userauth.isLogin,cartController.removecarts);

// update quantity
userRoute.post('/updatecart',userauth.isLogin,cartController.updatecart);

// checkout








//forgotpassword
userRoute.get("/forgotpassword",userController.forgotpassword)
userRoute.post('/getemail',userController.getemail)

//forgototp
userRoute.get("/forgototp",userController.forgototp);
// userRoute.post("/forgototp",userController.)


//
userRoute.post("/forgototp",userController.otpverification);


//
userRoute.get('/changepasswordform',userController.changepasswordform);
userRoute.post('/changepasswordform',userController.changepassword);

//filter
userRoute.get('/filter',productController.productfilter);
userRoute.get('/searching',productController.productsearching)


//checkout
userRoute.get('/checkout',orderController.checkout)
userRoute.post('/checkoutform',orderController.checkoutPost)

module.exports = userRoute;