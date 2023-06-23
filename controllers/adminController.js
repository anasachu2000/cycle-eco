const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModal');
const bcrypt = require('bcrypt');


let message = '';



//---------------- ADMIN LOGIN PAGE SHOWING SECTION START
const loadLogin = async(req,res,next)=>{
    try{
        res.render('login');
    }
    catch(err){
        next(err);
    }
}



//---------------- ADMIN VERIFY LOGIN SECTION START
const verifyLogin = async(req,res,next)=>{
    try{  
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email});
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                if(userData.is_admin === 0){
                    res.render('login',{message:'Email and password is incorrect'});
                }else{
                    req.session.auser_id = userData._id;
                    res.redirect('/admin/home');
                }
            }else{
                res.render('login',{message:'Email and password is incorrect'});
            }
        }else{
            message='Email and Password is incorrect'
            res.render('login');
        }
    }
    catch(err){
        next(err);
    }
}



//---------------- ADMIN HOME SHOWING SECTION START
const loadDashbord = async (req, res, next) => {
    try {
      const adminData = await User.findById({ _id: req.session.auser_id });
      const users = await User.find({ is_block: false });
      const totalOrders = await Order.find();
      const totalProducts = await Product.find({ is_delete: false });
      const totalSaleResult = await Order.aggregate([
        {
          $match: {
            'products.status': 'Delivered'
          }
        },
        {
          $group: {
            _id: null,
            totalSale: {
              $sum: '$totalAmount'
            }
          }
        }
      ]);
  
      let totalSale = 0;
      if (totalSaleResult.length > 0) {
        totalSale = totalSaleResult[0].totalSale;
      }else {
        console.log('No orders found.');
      }



      const totalCodResult = await Order.aggregate([
        {
          $unwind: '$products'
        },
        {
          $match: { 'products.status': 'Delivered', paymentMethod: 'COD' }
        },
        {
          $group: {
            _id: null,
            totalCodAmount: { $sum: '$products.totalPrice' }
          }
        }
      ]);
  
      let totalCod = 0;
      if (totalCodResult.length > 0) {
        totalCod = totalCodResult[0].totalCodAmount;
      } else {
        console.log('No COD orders found.');
      }



      const totalOnlinePaymentResult = await Order.aggregate([
        {
          $unwind: '$products'
        },
        {
          $match: { 'products.status': 'Delivered', paymentMethod: 'onlinPayment' }
        },
        {
          $group: {
            _id: null,
            totalCodAmount: { $sum: '$products.totalPrice' }
          }
        }
      ]);
  
      let totalOnline = 0;
      if (totalOnlinePaymentResult.length > 0) {
        totalOnline = totalOnlinePaymentResult[0].totalCodAmount;
      } else {
        console.log('No online orders found.');
      }



      const totalWalletResult = await Order.aggregate([
        {
          $unwind: '$products'
        },
        {
          $match: { 'products.status': 'Delivered', paymentMethod: 'walletpayment' }
        },
        {
          $group: {
            _id: null,
            totalCodAmount: { $sum: '$products.totalPrice' }
          }
        }
      ]);
  
      let totalWallet = 0;
      if (totalWalletResult.length > 0) {
        totalWallet = totalWalletResult[0].totalCodAmount;
      } else {
        console.log('No wallet orders found.');
      }
  
      res.render('home', {
        admin: adminData,
        activePage: 'home',
        users,
        totalOrders,
        totalProducts,
        totalSale,
        totalCod,
        totalOnline,
        totalWallet,
      });

    } catch (err) {
      next(err);
    }
};
  



//---------------- ADMIN LOGOUT SECTION START
const adminLogout = async (req,res,next)=>{
    try{
        req.session.destroy();
        res.redirect('/admin')
    }catch(err){
        next(err);
    }
}



//---------------- ADMIN USERLIST SHOWING SECTION START
const loadUserList = async (req,res,next)=>{
    try{
        const adminData = await User.findById({ _id: req.session.auser_id})
        const userData = await User.find({is_admin:0})
        res.render('userList',{admin:adminData,useres:userData,activePage: 'userList'});

    }catch(err){
        next(err);
    }
}



//---------------- ADMIN USER BLOCKING SECTION START
const block = async (req,res,next)=>{
    try{
        const userData = await User.findByIdAndUpdate(req.query.id,{$set:{is_block:true}});
        req.session.useres = null
        res.redirect('/admin/userList')
    }catch(err){
        next(err);
    }
}



//---------------- ADMIN USER UNBLOCKING SECTION START
const unblock = async (req,res,next)=>{
    try{
        const userData = await User.findByIdAndUpdate(req.query.id,{$set:{is_block:false}});
        res.redirect('/admin/userList')
    }catch(err){
        next(err);
    }
}



module.exports = {
    loadLogin,
    verifyLogin,
    loadDashbord,
    adminLogout,
    loadUserList,
    block,
    unblock,
}