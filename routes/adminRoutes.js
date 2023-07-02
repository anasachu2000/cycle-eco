const express = require('express');
const adminRoute = express();


const auth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const adminOrderController = require('../controllers/adminOrderController');
const couponController = require('../controllers/couponController');
const bannerController = require('../controllers/bannerController');
const update = require('../configuration/multer');
const errorHandler = require('../middleware/errorHandling');



adminRoute.set('view engine', 'ejs');
adminRoute.set('views', './views/admin');



//------------------ ADMIN LOGIN AND LOGOUT ROUTE SECTION START
adminRoute.get('/', auth.isLogout, adminController.loadLogin);
adminRoute.post('/', adminController.verifyLogin);
adminRoute.get('/home', auth.isLogin, adminController.loadDashbord);
adminRoute.get('/logout', auth.isLogin, adminController.adminLogout);



//------------------ USERLIST ROUTE SECTION START
adminRoute.get('/userList', auth.isLogin, adminController.loadUserList);
adminRoute.get('/blockUser', auth.isLogin, adminController.block);
adminRoute.get('/unblockUser', auth.isLogin, adminController.unblock);



//------------------ CATEGORYLIST ROUTE SECTION START
adminRoute.get('/categoryList',auth.isLogin, categoryController.loadCategory);
adminRoute.post('/categoryList',categoryController.insertCategory);
adminRoute.get('/categoryList/:id',auth.isLogin,categoryController.editCategory);
adminRoute.post('/updateCategory',categoryController.updateCategory);
adminRoute.get('/deleteCategory',auth.isLogin,categoryController.deleteCategory);



//------------------ PRODUCTLIST ROUTE SECTION START
adminRoute.get("/productList", auth.isLogin, productController.loadProductlist);
adminRoute.post("/productList", update.upload.array("image", 10), productController.insertProduct);
adminRoute.get('/editProductList/:id',auth.isLogin,productController.editproduct);
adminRoute.post('/editProductList/:id',update.upload.array("image", 10),productController.updateProduct);
adminRoute.get('/deleteProduct',auth.isLogin,productController.deleteProduct);
adminRoute.get('/deleteimg/:imgid/:prodid',auth.isLogin,productController.deleteimage);
adminRoute.post("/editProductList/updateimage/:id",update.upload.array('image'),productController.updateimage)



//---------------- ORDERLIST ROUTE SECTION START
adminRoute.get('/orderList',auth.isLogin,adminOrderController.loadOrderList);
adminRoute.get('/singleOrderList/:id',auth.isLogin,adminOrderController.loadSingleOrderList);
adminRoute.post('/changeStatus',adminOrderController.cahngeStatus);



//---------------- COUPONLIST ROUTE SECTION START
adminRoute.get('/couponList',auth.isLogin,couponController.loadCopon);
adminRoute.post('/addCoupon',couponController.addCoupon);
adminRoute.post('/editCoupon/:id',couponController.editCoupon);
adminRoute.get('/deleteCoupon',auth.isLogin,couponController.deleteCoupon);



//---------------- ADD OFFER ROUTE SECTION START
adminRoute.post('/addOffer',productController.addOffer);



//---------------- SALES REPORT ROUTE SECTION START
adminRoute.get('/saleReport',auth.isLogin,adminController.loadSalesReport);
adminRoute.get('/salesReportPdf/:id',auth.isLogin,adminController.salesReportPdf);
adminRoute.get('/salesReportSort/:id',auth.isLogin,adminController.salesReportSort);



//---------------- bannerList ROUTE SECTION START
adminRoute.get('/bannerList',auth.isLogin,bannerController.loadBanner)
adminRoute.post('/insertBanner',update.upload.single("image"),bannerController.insertBanner)
adminRoute.post('/editBanner', update.upload.single('image'),bannerController.editBanner);






adminRoute.use(errorHandler);


adminRoute.get('*',(req,res)=>{
  res.redirect('/admin')
});

module.exports = adminRoute;
