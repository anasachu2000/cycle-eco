const User = require('../models/userModel')
const Product  = require('../models/productModal');
const Cart = require('../models/cartModel')



//---------------- USER CART SHOWING SECTION START
const loadCart = async(req,res,next)=>{
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
  } catch (err) {
    next(err);
  }
}
       
 

//---------------- USER CART ADDING SECTION START
const addToCart = async (req,res,next) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findOne({ _id: userId });
   
    const productId = req.body.id;
    const productData = await Product.findOne({ _id: productId });

    const productQuantity = productData.stockQuantity;

    const cartData = await Cart.findOneAndUpdate(
      { userId: userId },
      {
        $setOnInsert: {
          userId: userId,
          userName: userData.name,
          products: [],
        },
      },
      { upsert: true, new: true }
    );
    const updatedProduct = cartData.products.find((product) => product.productId.toString() === productId.toString());
    const updatedQuantity = updatedProduct ? updatedProduct.count : 0;

    if (updatedQuantity + 1 > productQuantity) {
      return res.json({
        success: false,
        message: "Quantity limit reached!",
      });
    }

    const cartProduct = cartData.products.find((product) => product.productId.toString() === productId.toString());
     
    const discount =  productData.discountPercentage;          
    const price =  productData.price 
    const discountAmount = Math.round((price*discount)/100)
    const total = price - discountAmount

    if (cartProduct) {
      await Cart.updateOne(
        { userId: userId, "products.productId": productId },
        {
          $inc: {
            "products.$.count": 1,
            "products.$.totalPrice": total,
          },
        }
      );
    } else {
      cartData.products.push({
        productId: productId,
        productPrice: total,
        totalPrice: total,
      });
      await cartData.save();
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};



//---------------- USER CART PRODUCT QUANTITY CHANGING SECTION START
const changeProductCount = async (req,res,next) => {
  try {
    const userData = req.session.user_id;
    const proId = req.body.product;
    let count = req.body.count;
    count = parseInt(count);
    const cartData = await Cart.findOne({ userId: userData });
    const product = cartData.products.find((product) => product.productId === proId);
    const productData = await Product.findOne({ _id: proId });  
    const productQuantity = productData.stockQuantity
    const updatedCartData = await Cart.findOne({ userId: userData });
    const updatedProduct = updatedCartData.products.find((product) => product.productId === proId);
    const updatedQuantity = updatedProduct.count;
    
    if (count > 0) {
      if (updatedQuantity + count > productQuantity) {
        res.json({ success: false, message: 'Quantity limit reached!' });
        return;
      }
    } else if (count < 0) {
      // Quantity is being decreased
      if (updatedQuantity <= 1 || Math.abs(count) > updatedQuantity) {
        // await Cart.updateOne(
        //   { userId: userData },
        //   { $pull: { products: { productid: proId } } }
        // );
        res.json({ success: true });
        return;
      }
    }

    const cartdata = await Cart.updateOne(
      { userId: userData, "products.productId": proId },
      { $inc: { "products.$.count": count } }
    );


    const updateCartData = await Cart.findOne({ userId: userData });
    const updateProduct = updateCartData.products.find((product) => product.productId === proId);
    const updateQuantity = updateProduct.count;

    const discount =  productData.discountPercentage;          
    const price =  productData.price 
    const discountAmount = Math.round((price*discount)/100)
    const total = price - discountAmount
    const prices = updateQuantity * total;

    await Cart.updateOne(
      { userId: userData, "products.productId": proId },
      { $set: { "products.$.totalPrice": prices } }
    ); 
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};



//---------------- USER CART DELETING SECTION START
const deletecart  = async (req,res,next) =>{
  try {
    const userData = req.session.user_id;
    const proId = req.body.product;
    const cartData = await Cart.findOne({ userId: userData });
    if (cartData.products.length === 1) {
       await Cart.deleteOne({ userId: userData });
    } else {
        await Cart.updateOne(
        { userId: userData },
        { $pull: { products: { productId: proId } } }
      );
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}



module.exports = {
  loadCart,
  addToCart,
  changeProductCount,
  deletecart,
}