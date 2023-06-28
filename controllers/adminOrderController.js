const User = require('../models/userModel');
const Order = require('../models/orderModel');



//---------------- ADMIN ORDERLIST SHOWING SECTION START
const loadOrderList = async (req,res,next)=>{
  try{
    const adminData = await User.findById(req.session.auser_id);  
    const DeletePending = await Order.deleteMany({status:'pending'})
    const orderData = await Order.find().populate("products.productId")

    const page = parseInt(req.query.page) || 1; 
    const limit = 20; 
    const startIndex = (page - 1) * limit; 
    const endIndex = page * limit; 
    const orderCount = orderData.length;
    const totalPages = Math.ceil(orderCount / limit); 
    const paginatedOrder = orderData.slice(startIndex, endIndex);


    if(orderData.length > 0){
      res.render('orderList', 
      { 
        admin: adminData, 
        activePage: 'orderList',
        order:orderData,
        order: paginatedOrder, 
        currentPage: page,
        totalPages: totalPages,
      });
    }else{
      res.render('orderList', 
      { 
        admin: adminData, 
        activePage: 'orderList',
        order:[],
        order: paginatedOrder, 
        currentPage: page,
        totalPages: totalPages,
      });
    }
    
  }catch(err){
    next(err);
  }
}



//---------------- ADMIN SINGLE  ORDERLIST SHOWING SECTION START
const loadSingleOrderList = async (req,res,next)=>{
  try{
    const id = req.params.id;
    const adminData = await User.findById(req.session.auser_id);  
    const orderData = await Order.findOne({_id:id}).populate("products.productId")


    const page = parseInt(req.query.page) || 1; 
    const limit = 20; 
    const startIndex = (page - 1) * limit; 
    const endIndex = page * limit; 
    const orderCount = orderData.products.length;
    const totalPages = Math.ceil(orderCount / limit); 
    const paginatedOrder = orderData.products.slice(startIndex, endIndex);;


    res.render('orderDetails', 
    { 
      admin: adminData, 
      activePage: 'orderList',
      order:orderData,
      orders: paginatedOrder, 
      currentPage: page,
      totalPages: totalPages,
    });
  }catch(err){
    next(err);
  }
}



//---------------- ADMIN ORDER STATUS CHANGING SECTION START
const cahngeStatus = async(req,res,next)=>{
  try{
    const status = req.body.status;
    const orderId = req.body.orderId;
    const userId = req.body.userId;

    const updateOrder = await Order.findOneAndUpdate(
      {
        userId: userId,
        'products._id': orderId
      },
      {
        $set: {
          'products.$.status': status
        }
      },
      { new: true }
    );
    if(status === 'Delivered'){
      await Order.findOneAndUpdate(
        {
          userId: userId,
          'products._id': orderId
        },
        {
          $set: {
            'products.$.deleveryDate': new Date()
          }
        },
        { new: true }
      );
    }
    if(updateOrder){
      res.json({success:true})
    }

  }catch(err){
    next(err)
  }
}



module.exports = {
  loadOrderList,
  loadSingleOrderList,
  cahngeStatus,
}