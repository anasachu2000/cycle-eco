const User = require('../models/userModel');
const Address = require('../models/addressModel');
const Cart = require('../models/cartModel');



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



const insertCheckoutAddresss = async (req,res)=>{
    try {
      const addressDetails = await Address.findOne({userId:req.session.user_id});
      console.log(addressDetails);
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
      console.log(address);    
      const addressData = await address.save();
      if(addressData){
      res.redirect('/checkout');
  }else{
      res.redirect('/checkout');
  
  }
  }
  } catch (error) {
      console.log(error.message);
  }
  }



//-------- Edit address section  -----------//
const editCheckoutAddress = async (req,res)=>{
    try {
     const id = req.params.id;
     const session = req.session.user_id;
     const user = await User.find({})
     const addressData = await Address.findOne({userId:session},{addresses:{$elemMatch:{_id:id}}});
     const address = addressData.addresses;
     res.render('checkout',{address:address[0],session:session,user:user}) ;
    } catch (error) {
      console.log(error.message);
    }
  }


  //-------- Update address section  -----------//
const updateCheckoutAddress = async (req,res) =>{
    try{
      const session = req.session.user_id;
      const id = req.body.id;
      console.log(id);
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
    }catch(error){
      console.log(error.message);
    }
  }


  const deleteCheckoutAddress = async (req, res) => {
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
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "An error occurred while deleting the address" });
    }
  };



module.exports = {
    insertCheckoutAddresss,
    editCheckoutAddress,
    updateCheckoutAddress,
    deleteCheckoutAddress,
    loadcheckout,
}