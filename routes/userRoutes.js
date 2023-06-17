const express = require('express')
const userRoute = express();
const auth = require('../middleware/userAuth');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const checkoutController  = require('../controllers/checkoutController');
const addressControler  = require('../controllers/addressController')
const orderController = require('../controllers/orderController');
const wishlistController = require('../controllers/wishlistController');
const errorHandler = require('../middleware/errorHandling');

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



//------------------ Checkout route start
userRoute.get('/checkout',auth.blocked,auth.isLogin,checkoutController.loadcheckout);
userRoute.post('/checkOutAddressList',checkoutController.insertCheckoutAddresss);
userRoute.get('/editcheckoutAddress/:id',auth.blocked,auth.isLogin,checkoutController.editCheckoutAddress);
userRoute.post('/updatecheckOutAddress',checkoutController.updateCheckoutAddress);
userRoute.post('/deleteCheckoutAddress',checkoutController.deleteCheckoutAddress);
userRoute.post('/checkout',orderController.placeOrder);
userRoute.post('/verifyPayment',orderController.verifyPayment);



//------------------ Address route start
userRoute.get('/userdasboard',auth.blocked,auth.isLogin,addressControler.loadUserdashboard);
userRoute.get('/editUserData/:id',auth.isLogin,auth.blocked,addressControler.editUserDashboad);
userRoute.post('/updateUserData',addressControler.updateUserDashboard);
userRoute.get('/userAddress',auth.blocked,auth.isLogin,addressControler.loadUserAddress);
userRoute.post('/userAddressList',addressControler.insertUserAddresss);
userRoute.get('/editUserAddress/:id',auth.blocked,auth.isLogin,addressControler.editUserAddress);
userRoute.post('/updateUserAddress',addressControler.updateAddress);
userRoute.post('/deleteUserAddress',addressControler.deleteUserAddress);
userRoute.get('/UserOrder',auth.blocked,auth.isLogin,addressControler.loadeUserOrder);
userRoute.get('/viewOrder',addressControler.loadViewOrder);


//----------------- Search and filter section start
userRoute.post('/form',userController.searchProduct);
userRoute.get('/filterCategory/:id',userController.filterCategory);
userRoute.get('/priceSort/:id',userController.priceSort);


//---------------- Wishlist section start
userRoute.get('/wishlist',auth.blocked,auth.isLogin,wishlistController.loadWhislist);
userRoute.post('/addToWhislist',wishlistController.addToWhislist);
userRoute.post('/deleteWhislist',wishlistController.deleteWhislist);
userRoute.get('/deleteSingleWishlist',wishlistController.deleteSingleWishlist);

userRoute.use(errorHandler);

module.exports = userRoute; 