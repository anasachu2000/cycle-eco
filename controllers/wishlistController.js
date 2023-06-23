const Product = require('../models/productModal');
const User = require('../models/userModel');
const Wishlist = require('../models/wishlistModel');



//---------------- USER WISHLIST SHOWING SECTION START
const loadWhislist = async (req,res,next)=>{
  try{
      const session = req.session.user_id;
      const userData = await User.findById({_id:req.session.user_id});
      const wishlistData = await Wishlist.find({userId:session}).populate('products.productId');

      if(wishlistData.length > 0){
          const wishlist = wishlistData[0].products;
          const products = wishlist.map(wish => wish.productId);
          res.render('wishlist',{session,user:userData,wishlist,products});
      }else{
          res.render('wishlist',{session,user:userData,wishlist:[],products:[]});
      }
      
  }catch(err){
    next(err);
  }
}


  
//---------------- USER WISHLIST PRODUCT ADDING SECTION START
const addToWhislist = async (req,res,next) => {
  try {
    const id = req.body.wishlistId;
    const session = req.session.user_id;
    const userData = await User.findById(session);
    const wishlistData = await Wishlist.findOne({ userId: session });

    if (wishlistData) {
      const checkWishlist = await wishlistData.products.findIndex(
        (wish) => wish.productId == id
      );
    
      if (checkWishlist !== -1) {
        res.json({check:true});
      } else {
        await Wishlist.updateOne(
          { userId: session },
          { $push: { products: { productId: id } } }
        );
        res.json({ success: true });
      }
    } else {
      const wishlist = new Wishlist({
        userId: session,
        userName: userData.name,
        products: [
          {
            productId: id,
          },
        ],
      });
      const wish = await wishlist.save();
      if (wish) {
        res.json({ success: true });
      }
    }
  } catch (err) {
    next(err);
  }
};
  


//---------------- USER WISHLIST PRODUCT DELETING SECTION START
const deleteWhislist = async (req,res,next) =>{
  try{
      const id = req.body.deleteId;
      const session = req.session.user_id;
      const wishlistData = await Wishlist.findOneAndUpdate({userId:session},{$pull:{products:{productId:id}}});

      if(wishlistData){
          res.json({success:true});
      }else{
          res.json({success:true});
      }
  }catch(err){
    next(err);
  }
}



//---------------- USER WISHLIST SINGLE PRODUCT DELTING SECTION START
const deleteSingleWishlist = async (req, res, next) => {
  try {
    const id = req.params.id;
    const session = req.session.user_id;
    const wishlistData = await Wishlist.findOneAndUpdate(
      { userId: session },
      { $pull: { products: { productId: id } } }
    );
    if (wishlistData) {
      res.redirect('/singleProduct/' + id);
    }
  } catch (err) {
    next(err);
  }
};
  
 

module.exports = {
  loadWhislist,
  addToWhislist,
  deleteWhislist,
  deleteSingleWishlist
}