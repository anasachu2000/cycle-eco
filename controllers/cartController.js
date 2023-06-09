const User = require('../models/userModel')
const Product  = require('../models/productModal');
const Category = require('../models/categoryModel');
const Cart = require('../models/cartModel')
const Address = require('../models/addressModel');



// ---------- Cart loading section start
const loadCart = async(req,res)=>{
  try {
    let id = req.session.user_id;
    const session = req.session.user_id
    let userName = await User.findOne({ _id: req.session.user_id });
    let cartData = await Cart.findOne({ userId: req.session.user_id }).populate(
      "products.productId"
    );
    if (req.session.user_id) {
      if (cartData) {
        if (cartData.products.length > 0) {
          const products = cartData.products;
          const total = await Cart.aggregate([
            { $match: { userId: req.session.user_id } },
            { $unwind: "$products" },
            {
              $group: {
                _id: null,
                total: { $sum: { $multiply: ["$products.productPrice", "$products.count"] } },
              },
            },
          ]);
          const Total = total.length > 0 ? total[0].total : 0; 
           const totalAmount = Total+80;   
          const userId = userName._id;
          const userData = await User.find({})
          res.render("cart", { products:products,Total:Total,userId,session,totalAmount,user:userName});
        }else {
          res.render("emptyCart", {user:userName,session,message: "No Products Added to cart"});}
      }else {
        res.render("emptyCart", {user:userName,session,message: "No Products Added to cart",});
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
}
       
 

// ---------- Add to cart section start
const addToCart = async (req,res)=>{
  try{
    const userId = req.session.user_id;
    const userData = await User.findOne({_id:userId});
    const productId = req.body.id;
    const productData = await Product.findOne({_id:productId});
    const cartData = await Cart.findOne({userId:userData._id});

    if(cartData){
      const productExists = cartData.products.some(
        (product)=>product.productId == productId
      )
      if(productExists){
        await Cart.findOneAndUpdate({
          userId:userId,
          'products.productId':productId
        },
        {
          $inc: {'products.$.count':1}
        })
      }else{
        await Cart.findOneAndUpdate(
          { userId: userId },
          {
            $push: {
              products: {
                productId: productId,
                productPrice: productData.price,
                totalPrice:productData.price,
              },
            },
          }
        );        
      }
    }else{
      const newCart = new Cart({
        userId:userData._id,
        userName:userData.name,
        products:[{
          productId:productData._id,
          productPrice:productData.price,
          totalPrice:productData.price,
        }]
      })
      await newCart.save();
    }
    res.json({success:true})
  }catch(error){
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}



// ---------- Change product quantity in cart section
const changeProductCount = async (req, res) => {
  try {
    const userData = req.session.user_id;
    const proId = req.body.product;
    let count = req.body.count;
    count = parseInt(count);
    const cartData = await Cart.findOne({ userId: userData });
    const product = cartData.products.find((product) => product.productId === proId);
    const quantity = product.count;
    const productData = await Product.findOne({ _id: proId });
    
    const cartdata = await Cart.updateOne(
      { userId: userData, "products.productId": proId },
      { $inc: { "products.$.count": count } }
    );
    

    const updatedCartData = await Cart.findOne({ userId: userData });
    const updatedProduct = updatedCartData.products.find((product) => product.productId === proId);
    const updatedQuantity = updatedProduct.count;

    if (updatedQuantity < 1) {
      await Cart.updateOne(
        { userId: userData },
        {
          $pull: { products: { productId: proId } }
        }
      );
    }
    
    const price = updatedQuantity * productData.price;

    await Cart.updateOne(
      { userId: userData, "products.productId": proId },
      { $set: { "products.$.totalPrice": price } }
    );
  
    
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};


// ---------- Checkout loading section
const loadcheckout = async(req,res)=>{
  try {
    const session = req.session.user_id
    const userData = await User.findOne ({_id:req.session.user_id});
    const addressData = await Address.findOne({userId:req.session.user_id});
    const total = await Cart.aggregate([
      { $match: { userId: req.session.user_id } },
      { $unwind: "$products" },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$products.productPrice", "$products.count"] } },
        },
      },
    ]);

    if(req.session.user_id){
      if(addressData){
          if(addressData.addresses.length>0){
            const address = addressData.addresses
            const Total = total.length > 0 ? total[0].total : 0; 
            const totalAmount = Total+80;
            res.render('checkout',{session,Total,address,totalAmount,user:userData})
          }
          else{
            res.render('emptyCheckout',{session,user:userData,message:"Add your delivery address"});
          }
        }else{
          res.render('emptyCheckout',{session,user:userData,message:"Add your delivery address"});
        }
      }else{
        res.redirect('/')
      }
  } catch (error) {
    console.log(error.message);
  }
}



const deletecart  = async (req,res) =>{
  try {
    const userData = req.session.user_id;
    const proId = req.body.product;
    const cartData = await Cart.findOne({ userId: userData });
    if (cartData.products.length === 1) {
       const c  = await Cart.deleteOne({ userId: userData });
       console.log(c);
    } else {
      const v = await Cart.updateOne(
        { userId: userData },
        { $pull: { products: { productId: proId } } }
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}


module.exports = {
    loadCart,
    addToCart,
    changeProductCount,
    loadcheckout,
    deletecart
}