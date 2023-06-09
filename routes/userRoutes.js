const express = require('express')
const userRoute = express();
const auth = require('../middleware/userAuth');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const checkoutController  = require('../controllers/checkoutController');
const addressControler  = require('../controllers/addressController')


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


// //------------------ Address route start
//userRoute.get('/insertAddress', auth.blocked, auth.isLogin, checkoutController.loadInsertAddress);
//userRoute.post('/addAddress', checkoutController.insertAddresss);


// userRoute.get('/editAddress',auth.blocked,auth.isLogin,checkoutController.editAddress);
// userRoute.post('/updateAddress',checkoutController.updateAddress);
// userRoute.post('/deleteAddress',checkoutController.deleteAddress);
// userRoute.get('/showAddress',auth.blocked,auth.isLogin,checkoutController.loadAddress);




userRoute.get('/userdasboard',auth.blocked,auth.isLogin,addressControler.loadUserdashboard);
userRoute.get('/editUserData/:id',auth.blocked,addressControler.editUserDashboad);
userRoute.post('/updateUserData',addressControler.updateUserDashboard);
userRoute.get('/userAddress',addressControler.loadUserAddress);
userRoute.post('/userAddressList',addressControler.insertUserAddresss);
userRoute.get('/editUserAddress/:id',addressControler.editUserAddress);
userRoute.post('/updateUserAddress',addressControler.updateAddress);

module.exports = userRoute; 