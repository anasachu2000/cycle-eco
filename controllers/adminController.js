const User = require('../models/userModel');
const bcrypt = require('bcrypt');

let message = '';


//---------- login page view section ----------//
const loadLogin = async(req,res,next)=>{
    try{
        res.render('login');
    }
    catch(err){
        next(err);
    }
}


//---------- Verify login section ----------//
const verifyLogin = async(req,res,next)=>{
    try{  
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email});
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                if(userData.is_admin === 0){
                    res.render('login',{message:'Email and password is incorrect'});
                }else{
                    req.session.auser_id = userData._id;
                    res.redirect('/admin/home');
                }
            }else{
                res.render('login',{message:'Email and password is incorrect'});
            }
        }else{
            message='Email and Password is incorrect'
            res.render('login');
        }
    }
    catch(err){
        next(err);
    }
}


//---------- Home view section ----------//
const loadDashbord = async (req,res,next)=>{
    try{
        const adminData = await User.findById({ _id: req.session.auser_id})
        res.render('home',{admin:adminData,activePage: 'home' });
    }
    catch(err){
        next(err);
    }
}


//---------- Admin logout section ----------//
const adminLogout = async (req,res,next)=>{
    try{
        req.session.destroy();
        res.redirect('/admin')
    }catch(err){
        next(err);
    }
}


//---------- user view section ----------//
const loadUserList = async (req,res,next)=>{
    try{
        const adminData = await User.findById({ _id: req.session.auser_id})
        const userData = await User.find({is_admin:0})
        res.render('userList',{admin:adminData,useres:userData,activePage: 'userList'});

    }catch(err){
        next(err);
    }
}

const block = async (req,res,next)=>{
    try{
        const userData = await User.findByIdAndUpdate(req.query.id,{$set:{is_block:true}});
        req.session.useres = null
        res.redirect('/admin/userList')
    }catch(err){
        next(err);
    }
}

const unblock = async (req,res,next)=>{
    try{
        const userData = await User.findByIdAndUpdate(req.query.id,{$set:{is_block:false}});
        // req.session.useres = null
        res.redirect('/admin/userList')
    }catch(err){
        next(err);
    }
}




module.exports = {
    loadLogin,
    verifyLogin,
    loadDashbord,
    adminLogout,
    loadUserList,
    block,
    unblock,
}