const mongoose = require('mongoose');

const wishlistSChema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        ref:'User',
    },
    userName:{
        type:String,
        required:true,
    },
    products:[{
        productId:{
           type:mongoose.Schema.Types.ObjectId,
           required:true,
           ref:'Product',
        },
    }]
});

const Wishlist = mongoose.model('Wishlist',wishlistSChema);

module.exports = Wishlist;