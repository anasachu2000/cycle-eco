const express = require('express')
const userRoute = express();
const auth = require('../middleware/userAuth');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const addressController  = require('../controllers/addressController');



userRoute.set('view engine','ejs');
userRoute.set('views','./views/user');



userRoute.get('/login',auth.isLogout,userController.loadLogin);
userRoute.get('/register',auth.isLogout,userController.loadRegister);
userRoute.get('/otpVerificaton',userController.loadOtpVerification);
userRoute.post('/register',userController.insertUser);
userRoute.post('/login',userController.verifyLogin);
userRoute.get('/logout',auth.isLogin,userController.userLogout);
userRoute.post('/otpVerificaton',userController.verifyEmail);


userRoute.get('/',userController.loadHome);
userRoute.get('/home',userController.loadHome);
userRoute.get('/product',userController.loadProducts);
userRoute.get('/singleProduct/:id',userController.loadSingleProduct);

//------------------ Cart route start
userRoute.get('/cart',auth.blocked,auth.isLogin,cartController.loadCart);
userRoute.post('/addToCart',cartController.addToCart);
userRoute.post('/changeQuantity',cartController.changeProductCount);
userRoute.post('/deletecart',cartController.deletecart);

userRoute.get('/checkout',auth.blocked,auth.isLogin,cartController.loadcheckout);


//------------------ Address route start
userRoute.get('/insertAddress',auth.blocked,auth.isLogin,addressController.loadInsertAddress);
userRoute.post('/addAddress',addressController.insertAddresss);
userRoute.get('/editAddress',auth.blocked,auth.isLogin,addressController.editAddress);
userRoute.post('/updateAddress',addressController.updateAddress);
userRoute.post('/deleteAddress',addressController.deleteAddress);



userRoute.get('/userdasboard',auth.blocked,auth.isLogin,userController.loadUserdashboard);
userRoute.get('/showAddress',auth.blocked,auth.isLogin,addressController.loadAddress);
userRoute.get('/editUserData/:id',auth.blocked,userController.editUserDashboad);
userRoute.post('/updateUserData',userController.updateUserDashboard);

module.exports = userRoute; 