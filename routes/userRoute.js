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

const wishlistController = require('../controllers/wishlistController');

const couponController = require("../controllers/couponController");


const userauth = require ('../middlewares/authUser');


userRoute.set('view engine', 'ejs')
userRoute.set('views', './views/user')


userRoute.get("/",userController.indexhome);


userRoute.get("/login",userauth.isLogout, (req, res) => {
    res.render("login");
})


userRoute.get("/otp", async (req, res) => {
    const userId = req.session.user_id
    const user = await User.findOne({_id:userId});
    const email = user.email;
    res.render("otp", { userId ,email});

});

userRoute.post('/otp', userController.verifyPost)


userRoute.post('/resendotp', (req, res) => {
    const { email, userId } = req.body;
    userController.resendmailUser(userId,res);
});



// SIGN-UP
userRoute.get("/signup",userauth.isLogout, userController.signup);
userRoute.post('/signup',userauth.isLogout, userController.insertUser);



// LOGIN
userRoute.post('/login', userController .verifyLogin);
userRoute.post('/',userauth.isLogout, userController.verifyLogin);


//indexhome
userRoute.get("/", userController.indexhome);
userRoute.post('/', userController.indexhome);

//blog
userRoute.get("/blog", userController.blog);
userRoute.post('/blog', userController.blog);

//user logout
userRoute.get('/logout',userController.userLogout);



//singleproduct
userRoute.get("/singleproduct", userController.singleproduct);
userRoute.post('/singleproduct', userController.singleproduct);

//shop
userRoute.get("/shop",userauth.adminblock, userController.shop);
userRoute.post('/shop',userauth.adminblock, userController.shop);
//about
userRoute.get("/about",userauth.adminblock, userController.about);
userRoute.post('/about',userauth.adminblock, userController.about);
//useraccount
userRoute.get("/useraccount",userauth.adminblock,userauth.isLogin, userController.useraccount);

//resetpassword
userRoute.get("/resetpassword", userController.resetpassword);
userRoute.post('/resetpassword', userController.resetpassword);




//contact
userRoute.get("/contact", (req, res) => {
    res.render('contact')
})



// edit user
userRoute.post('/edituser', userauth.adminblock,userController. edituser);


//reset password 
userRoute.put('/resetpassword', userauth.adminblock,userController. resetpassword)


//adaddress 
userRoute.post('/adaddress', userauth.adminblock,addressController. Postaddress);

//editaddress
userRoute.patch('/editaddress',userauth.adminblock, addressController.Patchaddress);

// deletaddress
userRoute.delete('/deletaddress', userauth.adminblock,addressController.Deletaddress);



//cart

userRoute.get('/cart',userauth.adminblock, userauth.isLogin,cartController.cart);

userRoute.post('/getcart',userauth.adminblock,userauth.isLogin, cartController.getcart);

//remove cart
userRoute.post('/removecarts',userauth.adminblock, userauth.isLogin,cartController.removecarts);

// update quantity
userRoute.post('/updatecart',userauth.adminblock,userauth.isLogin,cartController.updatecart);



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
userRoute.get('/checkout',userauth.adminblock,orderController.checkout)
userRoute.post('/checkoutform',userauth.adminblock,orderController.checkoutPost)

userRoute.get('/success',orderController.success );

userRoute.get('/orderstatus',userauth.adminblock,orderController.orderstatus );
userRoute.delete('/orderstatus',orderController.cancelorder);

//return order
userRoute.delete('/returnorder',orderController.returnorders);

userRoute.post('/verifyPayments',userauth.adminblock,orderController.verifyPayment );

// wish list
userRoute.get('/wishlist',userauth.adminblock, userauth.isLogin,wishlistController.wishlist);

userRoute.post('/getwishlist',userauth.adminblock, userauth.isLogin, wishlistController.getwishlist);

// remove wishlist
userRoute.patch('/removewishlist', userauth.adminblock,userauth.isLogin, wishlistController.removewishlist);


userRoute.post('/applycoupons', userauth.adminblock,userauth.isLogin, couponController.applycoupon);
// remove coupon
userRoute.delete('/removecoupons', userauth.adminblock,userauth.isLogin, couponController.removecoupon);


// invoice downlode
userRoute.get('/invoice', userauth.isLogin,userController.invoice);

userRoute.get('/500', userauth.isLogin,userController.Internalerror);



module.exports = userRoute;