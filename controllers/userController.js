const User = require('../models/userModel')
//---------using passoword convertion-------//
const bcrypt = require('bcrypt');

const Product  = require('../models/productModal');
const Category = require('../models/categoryModel');
const nodemailer = require('nodemailer');
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
const loadRegister = async(req,res)=>{
    try{
        res.render('register');
    }catch(error){
        console.log(error.message);
    }
}



//---------- Load login page ----------//
const loadLogin  = async(req,res)=>{
    try{
        res.render('login')
    }
    catch(error){
        console.log(error.message);
    }
}



//---------- load otp verification page ----------//
const loadOtpVerification = async(req,res)=>{
    try{
        res.render('otpVerificaton');
    }catch(error){
        console.log(error.message);
    }
}



//-------- User registration section  -----------//
let email
const insertUser = async(req,res)=>{
    try{
         //password security
         const cfPasword = req.body.CfPassword;
         const password = req.body.password;
         if(cfPasword === password){
         const spassword = await securePassword(password);
         //-----------------
         const user = new User({
            name:req.body.name,
            number:req.body.number,
            email:req.body.email,
            password:spassword,
            is_admin:0,
         })       
         email = user.email
         const name = req.body.name
         const existingUser = await User.findOne({email:req.body.email});
         if(existingUser){
            res.render('register',{message: 'Email is already registered' })
         }else{
            const userData = await user.save();
            if(userData){
                randomnumber = Math.floor(Math.random()*9000)+1000
                otp = randomnumber
                console.log(otp);
                sendVerifyMail(name,req.body.email,randomnumber);
                res.redirect('/otpVerificaton')
            }else{
                res.render('register',{message:'your registaion has been failed'})
            }
         }
        }else{
          res.render('register',{message:'your password has been miss match'})
        }   

    }catch(error){
        console.log(error.message);
    }
}



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
const verifyEmail = async (req,res)=>{
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
    } catch (error) {
        console.log(error.message);
    }
  }

 
  
//-------- User verification section  -----------//
const verifyLogin = async (req,res)=>{
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
    catch(error){
        console.log(error.message);
    }
}



//-------- Home page loading section  -----------//
const loadHome = async (req, res) => {
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
    } catch (error) {
      console.log(error.message);
    }
  };



//---------- Logout section  ----------//
const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
}; 



//-------- Product page loading section  -----------//
const loadProducts = async (req,res)=>{
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
      } catch (error) {
        console.log(error.message);
      }
}



//-------- Single product view -----------//
const loadSingleProduct = async (req, res) => {
  try {
    if (req.session.user_id) {
     const session = req.session.user_id
     const id = req.params.id
      const productData = await Product.findOne({ _id: id });
      const userData = await User.findById({_id: req.session.user_id})
      res.render("singleProduct", { product: productData,user:userData,session });
    } else {
           const session = null
           const id = req.params.id
      const productData = await Product.findOne({ _id: id });
      res.render("singleProduct", { product: productData ,session});
    }
  } catch (error) {
    console.log(error.message);
  }
};



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
    loadUserdashboard,
    editUserDashboad,
    updateUserDashboard,
}