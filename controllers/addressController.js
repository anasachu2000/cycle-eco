const User = require('../models/userModel');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModal');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path')
const ejs = require('ejs')


//---------------- DASHBOARD SHOWING SECTION START
const loadUserdashboard = async (req,res,next) =>{
  try{
    const session = req.session.user_id;
    const userData = await User.findById({_id:session});
    res.render('userDashboard',{session,user:userData});

  }catch(err){
    next(err);
  }
} 



//---------------- DASHBOARD EDITING SECTION START
const editUserDashboad = async (req,res,next) =>{
  try{
    const id = req.params.id;
    const userData = await User.findById(req.session.user_id)
    if(userData){
      res.render('userDashboard',{user:userData});
    }else{
      res.redirect('/userdasboard');
    }
  }catch(err){
    next(err);
  }
}



//---------------- DASHBOARD UPDATING SECTION START  
const updateUserDashboard = async (req,res,next) => {
  try {
    const id = req.body.id;
    const updateDashboard = await User.findByIdAndUpdate(id, {name: req.body.name,number: req.body.number});
    if (updateDashboard) {
      res.redirect('/userdasboard');
    } else {
      res.redirect('/userdasboard');
    }
  } catch (err) {
    next(err);
  }
};



//---------------- USER ADDRESS SHOWING SECTION START
const loadUserAddress = async (req,res,next) =>{
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
  }catch(err){
    next(err);
  }
} 



//---------------- USER ADDRESS INSERTING SECTION START
const insertUserAddresss = async (req,res,next)=>{
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
      const addressData = await address.save();
      if(addressData){
      res.redirect('/userAddress');
  }else{
      res.redirect('/userAddress');
  
  }
  }
  } catch (err) {
    next(err);
  }
}



//---------------- USER EDIT ADDRESS SECTION START
const editUserAddress = async (req,res,next)=>{
  try {
    const id = req.params.id;
    const session = req.session.user_id;
    const user = await User.find({})
    const addressData = await Address.findOne({userId:session},{addresses:{$elemMatch:{_id:id}}});
    const address = addressData.addresses;
    res.render('userAddress',{address:address[0],session:session,user:user}) ;
  } catch (err) {
    next(err);
  }
}



//---------------- USER ADDRESS UPDATING SECTION START
const updateAddress = async (req,res,next) =>{
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
      res.redirect('/userAddress')
  }catch(err){
    next(err);
  }
}



//---------------- DELETE USER ADDRESS SECTION START
const deleteUserAddress = async (req,res,next) => {
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



//---------------- USER ORDER SHOWING SECTION START
const loadeUserOrder = async(req,res,next)=>{
  try{
    const session = req.session.user_id;
    const userData = await User.findById(session);
    const DeletePending = await Order.deleteMany({status:'pending'})
    const orderData = await Order.find({ userId: session }).populate("products.productId")
    const orderProducts = orderData.map(order => order.products); 
    res.render('order',{user:userData,session,orders:orderData});

  }catch(err){
    next(err)
  }
}



//---------------- USER SINGLE ORDER SHOWING SECTION START 
const loadViewOrder = async (req,res,next)=>{
  try{
    const id = req.params.id;
    const session = req.session.user_id;
    const userData = await User.findById(session); 
    const orderData = await Order.findOne({_id:id}).populate('products.productId');
    const orderDate = orderData.date
    const expectedDate = new Date(orderDate.getTime() + (5 * 24 * 60 * 60 * 1000)); 
    res.render('viewOrder',{user:userData,session,order:orderData,expectedDate});

  }catch(err){
    next(err)
  }
}
  


//---------------- USER ORDER CANSEL SECTION START
const cancelOrder = async (req,res,next)=>{
  try{
    const id = req.body.ordersid;
    const reason = req.body.reason;
    const ordId = req.body.orderid;
    const session = req.session.user_id;
    const orderData = await Order.findOne({userId:session,'products._id':id})
    const product =  orderData.products.find((p) => p._id.toString() === id);
    const cancelAmount = product.totalPrice;
    const procount = product.count;
    const proId = product.productId;
    const updatedOrder = await Order.findOneAndUpdate({
      userId:session,
      'products._id':id,
    },{
      $set:{
        'products.$.status':'cancelled',
        'products.$.cancelReson':reason,
      }
    },{
      new:true
    }
    );
    if(updatedOrder){
      await Product.findByIdAndUpdate({_id:proId},{$inc:{stockQuantity:procount}});
      if(orderData.paymentMethod === 'onlinPayment' ||  orderData.paymentMethod === 'Wallet'){
        await User.findByIdAndUpdate({_id:session},{$inc:{wallet:cancelAmount}})
        await Order.findByIdAndUpdate(session, { $inc: { totalAmount: -cancelAmount } });
        res.redirect("/viewOrder/" + ordId)
      }else{
        res.redirect("/viewOrder/" + ordId);
      }
    }else{
      res.redirect("/viewOrder/" + ordId);
    }  
  }catch(err){
    next(err);
  }
}



//---------------- USER ORDER RETURN SECTION START
const returnOrder = async (req,res,next) =>{
  try{
    const id = req.body.ordersId;
    const reason = req.body.reasons;
    const ordId = req.body.orderId;
    const session = req.session.user_id;
    const orderData = await Order.findOne({userId:session,'products._id':id})
    const product =  orderData.products.find((p) => p._id.toString() === id);
    const returnAmount = product.totalPrice;
    const procount = product.count;
    const proId = product.productId;
    const updatedOrder = await Order.findOneAndUpdate({
      userId:session,
      'products._id':id,
    },{
      $set:{
        'products.$.status':'return',
        'products.$.returnReson':reason,
      }
    },{
      new:true
    }
    );
    if(updatedOrder){
      await Product.findByIdAndUpdate({_id:proId},{$inc:{stockQuantity:procount}});
      if(orderData.paymentMethod === 'onlinPayment' ||  orderData.paymentMethod === 'Wallet'){
        await User.findByIdAndUpdate({_id:session},{$inc:{wallet:returnAmount}})
        await Order.findByIdAndUpdate(session, { $inc: { totalAmount: -returnAmount } });
        res.redirect("/viewOrder/" + ordId)
      }else{
        res.redirect("/viewOrder/" + ordId);
      }
    }else{
      res.redirect("/viewOrder/" + ordId);
    }  
  }catch(err){
    next(err);
  }
}



//---------------- USER ORDER INVOICE DOWNLODE SECTION SECTION START
const loadinvoice = async (req, res) => {
  try {
    const id = req.params.id;
    const session = req.session.user_id;
    const userData = await User.findById({_id:session})
    const orderData = await Order.findOne({_id:id}).populate('products.productId');
    const date = new Date()
   
     data = {
      order:orderData,
      user:userData,
      date,
    }

    const filepathName = path.resolve(__dirname, '../views/user/invoice.ejs');
    const html = fs.readFileSync(filepathName).toString();
    const ejsData = ejs.render(html, data);
    
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(ejsData, { waitUntil: 'networkidle0' });
    const pdfBytes = await page.pdf({ format: 'Letter' });
    await browser.close();

   
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename= order invoice.pdf');
    res.send(pdfBytes);

  } catch (err) {
    console.log(err);
    res.status(500).send('An error occurred');
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
  loadeUserOrder,
  loadViewOrder,
  cancelOrder,
  returnOrder,
  loadinvoice,
}