const User = require('../models/userModel')
//---------using passoword convertion-------//
const bcrypt = require('bcrypt');
const Product  = require('../models/productModal');
const Category = require('../models/categoryModel');
const nodemailer = require('nodemailer');
const Wishlist = require('../models/wishlistModel');
const passwordValidator = require('password-validator');
let otp



//-------- Pasword security section -----------//
const securePassword = async (password) =>{
    try{
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch(error){
        console.log(error.message);
    }
}



//---------- Load register page ----------//
const loadRegister = async(req,res,next)=>{
    try{
        res.render('register');
    }catch(err){
        next(err);
    }
}



//---------- Load login page ----------//
const loadLogin  = async(req,res,next)=>{
    try{
        res.render('login')
    }
    catch(err){
        next(err);
    }
}



//---------- load otp verification page ----------//
const loadOtpVerification = async(req,res,next)=>{
    try{
        res.render('otpVerificaton');
    }catch(err){
      next(err);
    }
}



//-------- User registration section  -----------//
let email
const schema = new passwordValidator();
schema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().not().spaces();

const insertUser = async (req, res, next) => {
  try {
    const cfPassword = req.body.CfPassword;
    const password = req.body.password;
    const spassword = await securePassword(password)
    if (cfPassword === password && schema.validate(password)) {
      const user = new User({
        name: req.body.name,
        number: req.body.number,
        email: req.body.email,
        password: spassword,
        is_admin: 0,
      });
      email=req.body.email

      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.render('register', { message: 'Email is already registered' });
      }

      const userData = await user.save();
      if (userData) {
        // Registration successful
        randomnumber = Math.floor(Math.random() * 9000) + 1000;
        otp = randomnumber;
        console.log(otp);
        sendVerifyMail(req.body.name, req.body.email, randomnumber);
        return res.redirect('/otpVerificaton');
      } else {
        return res.render('register', { message: 'Your registration has failed' });
      }
    } else {
      // Password does not meet the requirements
      return res.render('register', {
        message:
          'Your password must be strong.',
      });
    }
  } catch (err) {
    next(err);
  }
};



//-------- User verification section  -----------//
const sendVerifyMail = async (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:  process.env.emil,
        pass:  process.env.pass,
      }
    });

    const mailOption = {
      from: 'muhammedanasea2000@gmail.com',
      to: email,
      subject: 'Verification Email',
      html: `<p>Hi ${name}, please click <a href="http://localhost:3000/otp">here</a> to verify and enter your verification email. This is your OTP: ${otp}</p>`
    };

    const info = await transporter.sendMail(mailOption);
    console.log("Email has been sent", info.response);

  } catch (error) {
    console.log(error.message);
  }
};



//-------- Email verification section  -----------//
const verifyEmail = async (req,res,next)=>{
    const otp2= req.body.otp;
    try { 
        if(otp2==otp){
            const UserData = await User.findOneAndUpdate({email:email},{$set:{is_verified:1}});
            if(UserData){
              res.redirect("/home");
            }
            else{
                console.log('something went wrong');
            }
        }
        else{
            res.render('otpVerificaton',{message:"Please Check the OTP again!"})
        }
    } catch (err) {
      next(err);
    }
  }

 
  
//-------- User verification section  -----------//
const verifyLogin = async (req,res,next)=>{
    try{
        const email = req.body.email
        const password = req.body.password
        const userData = await User.findOne({email:email});
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                if(userData.is_verified === true){
                    if(userData.is_block === true){
                        res.render('login',{message:'user is blocked'})
                    
                    }else{
                        req.session.user_id = userData._id;
                        res.redirect('/home')
                    }
                }else{
                    res.render('login',{message:'Email and pasword is incorrect'})
                }
            }
            else{
                res.render('login',{message:'Email and pasword is incorrect'})
            }
        }
        else{
            res.render('login',{message:'Email and pasword is incorrect'})
        }
    }
    catch(err){
      next(err);
    }
}



//-------- Home page loading section  -----------//
const loadHome = async (req, res,next) => {
    try {
      const session = req.session.user_id;
      const productData = await Product.find()
      
      
      if (!session) {
        return res.render("home",{session:session,product:productData});
      }
  
      const userData = await User.findById({_id:req.session.user_id});
      if (userData) {
        return res.render("home", { user: userData,session,product:productData});
      } else {
        const session = null
        return res.render("home",{session,product:productData});
      }
    } catch (err) {
      next(err)
    }
  };



//---------- Logout section  ----------//
const userLogout = async (req,res,next) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
}; 



//-------- Product page loading section  -----------//
const loadProducts = async (req,res,next)=>{
    try {
        const session = req.session.user_id;
        const productData = await Product.find()
        const categoryData = await Category.find({is_delete:false});
        
        if (!session) {
          return res.render("product",{session:session,category:categoryData,product:productData});
        }
    
        const userData = await User.findById({_id:req.session.user_id});
        if (userData) {
          return res.render("product", { user: userData,session,category:categoryData,product:productData});
        } else {
          const session = null
          return res.render("product",{session,category:categoryData,product:productData});
        }
      } catch (err) {
        next(err);
      }
}



//-------- Single product view -----------//
const loadSingleProduct = async (req,res,next) => {
  try {
    if (req.session.user_id) {
     const session = req.session.user_id
     const id = req.params.id
      const productData = await Product.findOne({ _id: id });
      const userData = await User.findById({_id: req.session.user_id})
      const wishlistData = await Wishlist.find({userId:session});

      let checkWishlist = -1;

      if(wishlistData.length > 0 ){
        checkWishlist = wishlistData[0].products.findIndex((wish) => wish.productId == id);
      }
      res.render("singleProduct", { product: productData,user:userData,session,wishlist:checkWishlist });
    } else {
           const session = null
           const id = req.params.id
           const productData = await Product.findOne({ _id: id });
           const wishlistData = await Wishlist.find({userId:session});
           let checkWishlist = -1;
           if(wishlistData.length > 0 ){
            checkWishlist = wishlistData[0].products.findIndex((wish) => wish.productId == id);
          }
      res.render("singleProduct", { product: productData ,session,wishlist:checkWishlist});
    }
  } catch (err) {
    next(err);
  }
};



const searchProduct = async (req,res,next)=>{
  try{
     const search = req.body.search;
     const session = req.session.user_id;
     const userData = await User.findById(session)
     const categoryData = await Category.find({is_delete:false});
     const productData = await Product.find(
     {$or: [
      {productName:{$regex:".*" + search + ".*", $options:'i'}},
      {brand:{$regex:".*" + search + ".*", $options:'i'}},
      {category:{$regex:".*" + search + ".*", $options:'i'}},]}
      );
     
     if(productData.length > 0){
      res.render('product',{session,category:categoryData,product:productData,user:userData});
     }else{
      res.render('product',{session,category:categoryData,product:productData,user:userData});
     }

  }catch(err){
    next(err);
  }
}



const filterCategory = async (req,res,next)=>{
  try{
    const id = req.params.id;
    const session = req.session.user_id;
    const categoryData = await Category.find({is_delete:false});
    const userData = await User.findById(session)
    const productData = await Product.find({category:id,is_delete:false})

    if(categoryData.length > 0){
      res.render('product',{product:productData,session,category:categoryData,user:userData});
    }else{
      res.render('product',{product:[],session,category:categoryData,user:userData});
      
    }
  }catch(err){
    next(err);
  }
}



const priceSort = async (req,res,next)=>{
  try{
    const id = req.params.id;
    const session = req.session.user_id;
    const userData = await User.findById(session);
    const categoryData = await Category.find({is_delete:false});
    const sortData = await Product.find().sort({price:id});
   
    if(sortData){
      res.render('product',{product:sortData,session,category:categoryData,user:userData});
    }else{
      res.redirect('/product')
    }
  }catch(err){
    next(err);
  }
}

module.exports = {
    loadHome,
    loadProducts,
    loadSingleProduct,
    loadRegister,
    loadLogin,
    loadOtpVerification,
    sendVerifyMail,
    verifyEmail,
    insertUser,
    verifyLogin,
    userLogout,
    searchProduct,
    filterCategory,
    priceSort,
}