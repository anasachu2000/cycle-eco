const User = require('../models/userModel');
const Address = require('../models/addressModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');



//---------------- USER CHECKOUT SHOWING SECTION START
const loadcheckout = async(req,res,next)=>{
  try {
    const session = req.session.user_id
    const userData = await User.findOne ({_id:req.session.user_id});
    const addressData = await Address.findOne({userId:req.session.user_id});
    const couponData = await Coupon.find({}); 
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
            res.render('checkout',{session,Total,address,totalAmount,user:userData,coupon:couponData})
          }
          else{
            res.render('emptyCheckout',{session,user:userData,coupon:couponData,message:"Add your delivery address"});
          }
        }else{
          res.render('emptyCheckout',{session,user:userData,coupon:couponData,message:"Add your delivery address"});
        }
      }else{
        res.redirect('/')
      }
  } catch (err) {
    next(err);
  }
}



//---------------- USER CHECKOUT INSERTING ADDRESS SECTION START
const insertCheckoutAddresss = async (req,res,next)=>{
    try {
      const addressDetails = await Address.findOne({userId:req.session.user_id});

     if(addressDetails){
      const updateOne = await Address.updateOne({userId:req.session.user_id},{$push:{addresses:{
              userName:req.body.Username,
              mobile:req.body.number,
              altrenativeMob:req.body.AltrenativeMobile,
              houseName:req.body.houseName,
              landmark:req.body.landmark,
              city:req.body.city,
              state:req.body.state,
              pincode:req.body.pincode,
          }}});
          if(updateOne){
              res.redirect('/checkout')
          }else{
              res.redirect('/');
          }
     }else{
      const address = new Address({
          userId:req.session.user_id,
          addresses:[{
              userName:req.body.Username,
              mobile:req.body.number,
              altrenativeMob:req.body.AltrenativeMobile,
              houseName:req.body.houseName,
              landmark:req.body.landmark,
              city:req.body.city,
              state:req.body.state,
              pincode:req.body.pincode,
          }]
      })     
      const addressData = await address.save();
      if(addressData){
      res.redirect('/checkout');
  }else{
      res.redirect('/checkout');
  
  }
  }
  } catch (err) {
    next(err);
  }
}



//---------------- USER CHECKOUT EDITING ADDRESS SECTION START
const editCheckoutAddress = async (req,res,next)=>{
  try {
    const id = req.params.id;
    const session = req.session.user_id;
    const user = await User.find({})
    const addressData = await Address.findOne({userId:session},{addresses:{$elemMatch:{_id:id}}});
    const address = addressData.addresses;
    res.render('checkout',{address:address[0],session:session,user:user}) ;
  } catch (err) {
    next(err);
  }
}



//---------------- USER CHECKOUT UPDATE ADDRESS SECTION START
const updateCheckoutAddress = async (req,res,next) =>{
  try{
    const session = req.session.user_id;
    const id = req.body.id;
    const address = await Address.updateOne({ userId: session }, { $pull: { addresses: { _id: id } } });
    const pushAddress = await Address.updateOne({userId:session},
      {$push:
        {addresses:{
          userName:req.body.Username,
          mobile:req.body.number,
          altrenativeMob:req.body.AltrenativeMobile,
          houseName:req.body.houseName,
          city:req.body.city,
          state:req.body.state,
          pincode:req.body.pincode,
          landmark:req.body.landmark,
        }
      }})
      res.redirect('/checkout')
  }catch(err){
    next(err);
  }
}



//---------------- USER CHECKOUT DELETING ADDRESS SECTION START
const deleteCheckoutAddress = async (req,res,next) => {
  try {
    const id = req.session.user_id;
    const addId = req.body.address;
    const addressData = await Address.findOne({ userId: id });
    if (addressData.addresses.length === 1) {
      await Address.deleteOne({ userId: id });
    } else {
      await Address.updateOne(
        { userId: id },
        { $pull: { addresses: { _id: addId } } }
      );
    }
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    next(err);
  }
};



module.exports = {
  insertCheckoutAddresss,
  editCheckoutAddress,
  updateCheckoutAddress,
  deleteCheckoutAddress,
  loadcheckout,
}