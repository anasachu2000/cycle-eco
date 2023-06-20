const mongoose = require('mongoose');

const userSChema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    number:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    wallet:{
        type:Number,
        default:0,
    },
    is_admin:{
        type:Number,
        required:true,
    },
    is_block:{
        type:Boolean,
        default:false,
    },
    is_verified:{
        type:Boolean,
        default:false,
    }
});

const User = mongoose.model('User',userSChema);

module.exports =  User;