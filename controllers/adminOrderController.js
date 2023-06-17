const User = require('../models/userModel');

const loadOrderList = async (req,res,next)=>{
    try{
      const adminData = await User.findById(req.session.auser_id);  
      res.render('orderList', { admin: adminData, activePage: 'orderList', });
  
    }catch(err){
      next(err);
    }
  }

  module.exports = {
    loadOrderList,
  }