const Product = require('../models/productModal');
const User = require('../models/userModel');
const Wishlist = require('../models/wishlistModel');


const loadWhislist = async (req,res)=>{
    try{
        const session = req.session.user_id;
        const userData = await User.find({})
        const wishlistData = await Wishlist.find({userId:session}).populate('products.productId');

        if(wishlistData.length > 0){
            const wishlist = wishlistData[0].products;
            const products = wishlist.map(wish => wish.productId);
            res.render('wishlist',{session,user:userData,wishlist,products});
        }else{
            res.render('wishlist',{session,user:userData,wishlist:[],products:[]});
        }
       
    }catch(error){
        console.log(error.message);
    }
}


  

const addToWhislist = async (req, res) => {
    try {
      const id = req.body.wishlistId;
      const session = req.session.user_id;
      const userData = await User.findById(session);
      const wishlistData = await Wishlist.findOne({ userId: session });

      if (wishlistData) {
        console.log(wishlistData)
        const checkWishlist = await wishlistData.products.findIndex(
          (wish) => wish.productId == id
        );
      
        if (checkWishlist !== -1) {
          res.redirect('/singleProduct')
        } else {
          await Wishlist.updateOne(
            { userId: session },
            { $push: { products: { productId: id } } }
          );
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
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  


  const deleteWhislist = async (req,res) =>{
    try{
        const id = req.body.deleteId;
        const session = req.session.user_id;
        const wishlistData = await Wishlist.findOneAndUpdate({userId:session},{$pull:{products:{productId:id}}});

        if(wishlistData){
            res.json({success:true});
        }else{
            res.json({success:true});
        }
    }catch(error){
        console.log(error);
    }
  }
module.exports = {
    loadWhislist,
    addToWhislist,
    deleteWhislist,
}