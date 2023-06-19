const express = require('express');
const adminRoute = express();


const auth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const adminOrderController = require('../controllers/adminOrderController');
const multer = require('multer');
const update = require('../configuration/multer');
const errorHandler = require('../middleware/errorHandling');

adminRoute.set('view engine', 'ejs');
adminRoute.set('views', './views/admin');


adminRoute.get('/', auth.isLogout, adminController.loadLogin);
adminRoute.post('/', adminController.verifyLogin);
adminRoute.get('/home', auth.isLogin, adminController.loadDashbord);
adminRoute.get('/logout', auth.isLogin, adminController.adminLogout);


//------------------ User list section
adminRoute.get('/userList', auth.isLogin, adminController.loadUserList);
adminRoute.get('/blockUser', auth.isLogin, adminController.block);
adminRoute.get('/unblockUser', auth.isLogin, adminController.unblock);


//------------------ Category list section
adminRoute.get('/categoryList',auth.isLogin, categoryController.loadCategory);
adminRoute.post('/categoryList',categoryController.insertCategory);
adminRoute.get('/categoryList/:id',auth.isLogin,categoryController.editCategory);
adminRoute.post('/updateCategory',categoryController.updateCategory);
adminRoute.get('/deleteCategory',auth.isLogin,categoryController.deleteCategory);


//------------------ Productlist list section
adminRoute.get("/productList", auth.isLogin, productController.loadProductlist);
adminRoute.post("/productList", update.upload.array("image", 10), productController.insertProduct);
adminRoute.get('/editProductList/:id',auth.isLogin,productController.editproduct);
adminRoute.post('/editProductList/:id',update.upload.array("image", 10),productController.updateProduct);
adminRoute.get('/deleteProduct',auth.isLogin,productController.deleteProduct);
adminRoute.get('/deleteimg/:imgid/:prodid',auth.isLogin,productController.deleteimage);
adminRoute.post("/editProductList/updateimage/:id",update.upload.array('image'),productController.updateimage)


//---------------- ORDER LIST SECTION START
adminRoute.get('/orderList',adminOrderController.loadOrderList);
adminRoute.get('/singleOrderList/:id',adminOrderController.loadSingleOrderList)



adminRoute.get('*',(req,res)=>{
  res.redirect('/admin')
});

adminRoute.use(errorHandler);

module.exports = adminRoute;
