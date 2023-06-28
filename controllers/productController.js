const { model } = require("mongoose");
const Product  = require('../models/productModal');
const User  = require('../models/userModel');
const Category = require('../models/categoryModel');
const fs = require('fs')
const path = require('path')



//---------------- ADMIN PRODUCT SHOWING SECTION START
const loadProductlist = async(req,res,next)=>{
  try{
      const categoryData = await Category.find({is_delete:false});
      const adminData = await User.findById({ _id: req.session.auser_id})
      const productData = await Product.find({is_delete:false});
      

      const page = parseInt(req.query.page) || 1; 
      const limit = 20; 
      const startIndex = (page - 1) * limit; 
      const endIndex = page * limit; 
      const productCount = productData.length;
      const totalPages = Math.ceil(productCount / limit); 
      const paginatedCategory = productData.slice(startIndex, endIndex);



      res.render('productList',
      {
        admin:adminData,
        activePage:'productList',
        category:categoryData,
        product:productData,
        product: paginatedCategory, 
        currentPage: page,
        totalPages: totalPages,
      });
  }catch(err){
    next(err);
  }
}



//---------------- ADMIN PRODUCT ADDING SECTION START
const insertProduct = async (req,res,next) => {
  try {
      const images = [];
      if (req.files && req.files.length > 0) {
          for (let i = 0; i < req.files.length; i++) {
          images.push(req.files[i].filename);
        }
      }
      const productName = req.body.productName.trim();
      const stockQuantity = req.body.stockQuantity.trim();
      const price = req.body.price.trim();
      if(productName && stockQuantity && price){
      const product = new Product({
          productName: productName,
          brand: req.body.brand,
          category: req.body.category,
          description: req.body.description,
          stockQuantity: stockQuantity,
          image: images,
          price: price,
      });
      const productData = await product.save(); 

      if (productData) {
          return res.redirect("/admin/productList");
      } else {
          return res.redirect("/admin/productList");
      }
    }else{
      return res.redirect("/admin/productList");
    }
  } catch (err) {
    next(err);
  }
};



//---------------- ADMIN PRODUCT DELETING SECTION START
const deleteProduct = async (req,res,next)=> {
  try{
    const id = req.query.id; 
    const product =   await Product.updateOne({ _id: id }, { $set: { is_delete: true } });
    res.redirect('/admin/productList');

  }catch(err){
    next(err);
  }
}



//---------------- ADMIN PRODUCT EDITING SECTION START
const editproduct = async(req,res,next) => {
    try {
      const id = req.params.id
      const productData = await Product.findOne({_id:id}).populate('category')
      const categoryData = await Category.find({is_delete:false})
      const adminData = await User.findById({_id:req.session.auser_id})
       res.render('editProductList',{admin:adminData,activePage: 'productList',category:categoryData,product:productData})
    } catch (err) {
      next(err);
    }
}



//---------------- ADMIN PRODUCT UPDATING SECTION START
const updateProduct = async (req,res,next) =>{
  if(req.body.productName.trim() === "" || req.body.category.trim() === "" || req.body.description.trim() === "" || req.body.StockQuantity.trim() === "" || req.body.price.trim() === "") {
      const id = req.params.id
      const productData = await Product.findOne({_id:id}).populate('category')
      const categoryData = Category.find()
      const adminData = await User.findById({_id:req.session.auser_id})
      res.render('editProductList',{admin:adminData,product: productData, message:"All fields required",category:categoryData})
  }else{
      try {
          const arrayimg = []
          for(file of req.files){
              arrayimg.push(file.filename)
          } 
          const id = req.params.id
          await Product.updateOne({_id:id},{$set:{
              productName:req.body.productName,
              category:req.body.category,
              stockQuantity:req.body.StockQuantity,
              price:req.body.price,
              description:req.body.description,
              brand:req.body.brand
          }})
          res.redirect('/admin/productList')
      } catch (err) {
        next(err);
      }
  }
}
 


//---------------- ADMIN PRODUCT IMAGE DELETING SECTION START
const deleteimage = async(req,res,next)=>{
  try{
    const imgid = req.params.imgid;
    const prodid = req.params.prodid;
    fs.unlink(path.join(__dirname,"../public/adminAssets/adminImages",imgid),()=>{})
    const productimg  = await  Product.updateOne({_id:prodid},{$pull:{image:imgid}})
    res.redirect('/admin/editProductList/'+prodid)
  }catch(err){
    next(err);
  }
}



//---------------- ADMIN PRODUCT IMAGE UPDATING SECTION START
const updateimage = async (req,res,next) => {
  try {
    const id = req.params.id
    const prodata = await Product.findOne({ _id: id })
    const imglength = prodata.image.length

    if (imglength <= 10) {
      let images = []
      for (file of req.files) {
        images.push(file.filename)
      }

      if (imglength + images.length <= 10) {

        const updatedata = await Product.updateOne({ _id: id }, { $addToSet: { image: { $each: images } } })

        res.redirect("/admin/editProductList/" + id)
      } else {
        const productData = await Product.findOne({ _id: id }).populate('category')
        const adminData = await User.findById({_id:req.session.Auser_id})
        const categoryData = await Category.find()
        res.render('editProductList', { admin:adminData,product: productData, category: categoryData , imgfull: true})
      }
    } else {
      res.redirect("/admin/editProductList/")
    }
  } catch (err) {
    next(err);
  }
}



//---------------- ADMIN OFFER ADDING SECTION START
const addOffer = async(req,res,next)=>{
  try {
      const productId = req.body.id
      const discountPercentage = req.body.discountPercentage
      const discountName = req.body.discountName
      const updateProduct = await Product.findOneAndUpdate(
          { _id: productId },
          {
            $set: {
              discountName: discountName,
              discountPercentage: discountPercentage
            }
          },
          { new: true }
        );  
       res.redirect("/admin/productList");  

  } catch (error) {
      
  }
}
 


module.exports = {
  loadProductlist,
  insertProduct,
  editproduct,
  deleteProduct,
  updateProduct,
  updateimage,
  deleteimage,
  addOffer,
}