const User = require('../models/userModel');
const Address = require('../models/addressModel')



//-------- Address loding section  -----------//
const loadAddress = async (req,res)=>{
  try {
    const session = req.session.user_id
    const userData = await User.findOne ({_id:req.session.user_id});
    const addressData = await Address.findOne({userId:req.session.user_id});
        if(session){
            if(addressData){
                const address = addressData.addresses
                res.render('userAddress',{user:userData,session,address:address})

            }else{
                res.render('emptyUserAddress',{user:userData,session})
            }
        }else{
            res.redirect('/home',{user:userData,session})
        }
} catch (error) {
    log(error.message)
}
}



//-------- load  Address inserting section  -----------//
const loadInsertAddress = async (req,res)=>{
  try {
    const session = req.session.user_id;
    
    if (!session) {
      return res.render("insertAddress",{session:session});
    }
    const userData = await User.findById({_id:req.session.user_id});
    if (userData) {
      return res.render("insertAddress", { user: userData,session});
    } else {
      const session = null
      return res.render("insertAddress",{session});
    }
  } catch (error) {
    console.log(error.message);
  }
}



//-------- Adrees inserting section  -----------//
const insertAddresss = async (req,res)=>{
  try {
    const addressDetails = await Address.findOne({userId:req.session.user_id});
    console.log(addressDetails);
   if(addressDetails){
    const updateOne = await Address.updateOne({userId:req.session.user_id},{$push:{addresses:{
            userName:req.body.userName,
            mobile:req.body.mobile,
            altrenativeMob:req.body.altrenativeMobile,
            houseName:req.body.house,
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
            userName:req.body.userName,
            mobile:req.body.mobile,
            altrenativeMob:req.body.altrenativeMobile,
            houseName:req.body.house,
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
const editAddress = async (req,res)=>{
  try {
   const id = req.query.id;
   const session = req.session.user_id;
   const user = await User.find({})
   const addressData = await Address.findOne({userId:session},{addresses:{$elemMatch:{_id:id}}});
   const address = addressData.addresses;
   res.render('editAddress',{address:address[0],session:session,user:user}) ;
  } catch (error) {
    console.log(error.message);
  }
}


//-------- Update address section  -----------//
const updateAddress = async (req,res) =>{
  try{
    const session = req.session.user_id;
    const id = req.query.id;
    const address = await Address.updateOne({ userId: session }, { $pull: { addresses: { _id: id } } });
    const pushAddress = await Address.updateOne({userId:session},
      {$push:
        {addresses:{
          userName:req.body.userName,
          mobile:req.body.mobile,
          altrenativeMob:req.body.altrenativeMobile,
          houseName:req.body.house,
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


const deleteAddress  = async (req,res) =>{
  try{
    const id = req.body.address;
    const session = req.session.user_id;
    const adressData = await Address.findOne({userId:session});
    if(adressData.addresses.length === 1){
      await Address.deleteOne({userId:session})
    }else{
      await Address.updateOne({ userId: session }, { $pull: { addresses: { _id: id } } });
    }
    res.status(200).json({message:'Address deleted successfully'})
  }catch(error){
    console.log(error.message);
  }
}
module.exports ={
    loadAddress,
    loadInsertAddress,
    insertAddresss,
    editAddress,
    updateAddress,
    deleteAddress,
}
