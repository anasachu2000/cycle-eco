const User = require('../models/userModel');
const Address = require('../models/addressModel')

const loadUserdashboard = async (req,res) =>{
    try{
      const session = req.session.user_id;
      const userData = await User.findById({_id:session});
      res.render('userDashboard',{session,user:userData});
  
    }catch(error){
      console.log(error.message)
    }
  } 
  
  
  const editUserDashboad = async (req,res) =>{
    try{
      const id = req.params.id;
      const userData = await User.findById(req.session.user_id)
      if(userData){
        res.render('userDashboard',{user:userData});
      }else{
        res.redirect('/userdasboard');
      }
    }catch(error){
      console.log(error.messaage);
    }
  }
  
  
  const updateUserDashboard = async (req, res) => {
    try {
      const id = req.body.id;
      const updateDashboard = await User.findByIdAndUpdate(id, {name: req.body.name,number: req.body.number});
      if (updateDashboard) {
        res.redirect('/userdasboard');
      } else {
        res.redirect('/userdasboard');
      }
    } catch (error) {
      console.log(error.message);
    }
  };



  const loadUserAddress = async (req,res) =>{
    try{
      const session = req.session.user_id;
      const userData = await User.findById({_id:session});
      const addressData = await Address.findOne({userId:session})
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
    }catch(error){
      console.log(error.message)
    }
  } 

//-------- Adrees inserting section  -----------//
const insertUserAddresss = async (req,res)=>{
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
              res.redirect('/userAddress')
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
      res.redirect('/userAddress');
  }else{
      res.redirect('/userAddress');
  
  }
  }
  } catch (error) {
      console.log(error.message);
  }
  }


  //-------- Edit address section  -----------//
const editUserAddress = async (req,res)=>{
    try {
     const id = req.params.id;
     const session = req.session.user_id;
     const user = await User.find({})
     const addressData = await Address.findOne({userId:session},{addresses:{$elemMatch:{_id:id}}});
     const address = addressData.addresses;
     res.render('userAddress',{address:address[0],session:session,user:user}) ;
    } catch (error) {
      console.log(error.message);
    }
  }


  //-------- Update address section  -----------//
const updateAddress = async (req,res) =>{
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
        res.redirect('/userAddress')
    }catch(error){
      console.log(error.message);
    }
  }


  const deleteUserAddress = async (req, res) => {
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
    loadUserdashboard,
    updateUserDashboard,
    editUserDashboad,
    loadUserAddress,
    insertUserAddresss,
    editUserAddress,
    updateAddress,
    deleteUserAddress,
}