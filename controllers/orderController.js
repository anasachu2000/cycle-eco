const Product = require('../models/productModal');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const razorpay = require('razorpay');

var instance = new razorpay({
  key_id: process.env.Razorpay_Key_Id,
  key_secret: process.env.Razorpay_Key_Secret,
});


const placeOrder = async (req, res) => {
    try {
      const id = req.session.user_id;
      const userName = await User.findOne({ _id: id });
      const address = req.body.address;
      const paymentMethod = req.body.payment;
      const cartData = await Cart.findOne({ userId: id });
      const products = cartData.products;
      const Total = parseInt(req.body.Total);
     
      
      const status = paymentMethod === 'COD' ? "placed" : "pending";
      const order = new Order({
        deliveryAddress: address,
        userId: id,
        userName: userName.name,
        paymentMethod: paymentMethod,
        products: products,
        totalAmount: Total,
        date: new Date(),
        status: status,
      });
      const orderData = await order.save();
      if(orderData){
        for(let i=0;i<products.length;i++){
          const pro = products[i].productId
          const count = products[i].count
          await Product.findByIdAndUpdate({_id:pro},{$inc:{stockQuantity:-count}})
        }
        if(order.status === 'placed'){
          await Cart.deleteOne({userId:id});
          res.json({codsuccess:true});
        }else{
          const orderId = orderData._id;
          const totalAmount = orderData.totalAmount;
          var options = {
            amount: totalAmount*100,
            currency:'INR',
            receipt:''+ orderId
          } 

         instance.orders.create(options,function(err,order){
            res.json({order});
          })
        }
      }else{
        res.redirect('/')
      }
    } catch (error) {
      console.log(error); 
    }
  };
  


const verifyPayment = async (req,res)=>{
  try{
    const details = req.body

    
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.Razorpay_Key_Secret);
    hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id);
    const hmacValue = hmac.digest('hex');
  
    if(hmacValue === details.payment.razorpay_signature){
      await Order.findByIdAndUpdate({_id:details.order.receipt},{$set:{status:"placed"}});
      await Order.findByIdAndUpdate({_id:details.order.receipt},{$set:{paymentId:details.payment.razorpay_payment_id}});
      await Cart.deleteOne({userId:req.session.user_id});
      res.json({success:true});
    }else{
      await Order.findByIdAndRemove({_id:details.order.receipt});
      res.json({success:false});
    }
  }catch(error){
      console.log(error.message)
  }
}

module.exports ={
    placeOrder,
    verifyPayment,
}