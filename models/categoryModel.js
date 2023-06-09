const mongoose = require('mongoose');

const categorySChema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
    },
    is_delete:{
        type:Boolean,
        default:false,
    },
});

const Category = mongoose.model('Category',categorySChema);

module.exports =  Category;