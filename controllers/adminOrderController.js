const User = require('../models/userModel');
const Order = require('../models/orderModel');


const loadOrderList = async (req,res,next)=>{
    try{
      const adminData = await User.findById(req.session.auser_id);  
      const DeletePending = await Order.deleteMany({status:'pending'})
      const orderData = await Order.find().populate("products.productId")
      if(orderData.length > 0){
        res.render('orderList', { admin: adminData, activePage: 'orderList',order:orderData});
      }else{
        res.render('orderList', { admin: adminData, activePage: 'orderList',order:[]});
      }
      
    }catch(err){
      next(err);
    }
  }


  const loadSingleOrderList = async (req,res,next)=>{
    try{
      const id = req.params.id;
      const adminData = await User.findById(req.session.auser_id);  
      const orderData = await Order.findOne({_id:id}).populate("products.productId")
      res.render('orderDetails', { admin: adminData, activePage: 'orderList',order:orderData});
    }catch(err){
      next(err);
    }
  }



  module.exports = {
    loadOrderList,
    loadSingleOrderList,
  }