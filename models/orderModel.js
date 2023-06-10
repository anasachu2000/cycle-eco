const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({

deliveryAddress:{
    type:String,
    required:true
},
userId:{
    type:String,
    required:true
},
userName:{
    type:String,
    required:true
},
paymentMethod:{
    type:String,
    required:true
},
paymentId:{
    type:String
},
products: [{
    productid:{
        type:String,
        required:true,
        ref:"product"
    },
    count:{
        type:Number,
        default:1,
    },
    productPrice:{
        type:Number,
        required:true,
    },
    totalPrice:{
        type:Number,
        default:0,
    }
}],
totalAmount:{
    type:Number,
    required:true
},
date:{
    type:Date
},
status:{
    type:String
},
},
)

const Order = mongoose.model("order",orderSchema);
module.exports = Order;