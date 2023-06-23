const Coupon = require('../models/couponModel')
const User = require('../models/userModel');



//---------------- ADMIN COUPON SHOWING SECTION START 
const loadCopon = async (req,res,next) => {
    try{
        const adminData = await User.findById(req.session.auser_id);
        const couponData = await Coupon.find({});  
        res.render('couponList', { admin: adminData,activePage: 'couponList',coupon:couponData});
    }catch(err){
        next(err)
    }
}



//---------------- ADMIN COUPON ADDING SECTION START 
const addCoupon = async (req,res,next) => {
    try {
        const coupon = new Coupon({
            code: req.body.code,
            discountType: req.body.discountType,
            startDate: req.body.startDate,
            expiryDate: req.body.expiryDate,
            discountPercentage: req.body.percentage,
        });
        const couponData = await coupon.save();
        if(couponData){
            res.redirect('/admin/couponList');
        }else{
            res.redirect('/admin/couponList');
        }
    } catch (err) {
        next(err);
    }
};



//---------------- ADMIN COUPON EDITING SECTION START 
const editCoupon = async(req,res,next)=>{
    try {
        const id = req.params.id
        const updateCoupen = await Coupon.findOneAndUpdate({_id:id},{
            $set:{
                code: req.body.code,
                discountType: req.body.discountType,
                startDate: req.body.startDate,
                expiryDate: req.body.expiryDate,
                discountPercentage: req.body.percentage,
            }
        })
        if(updateCoupen){
            res.redirect('/admin/couponList')
        }else{
            message='something error'
            res.redirect('/admin/couponList')
        }
    } catch (err) {
        next(err)
    }
}



//---------------- ADMIN COUPON DELETING SECTION START 
const deleteCoupon = async (req,res,next) =>{
    try{
        const id = req.query.id;
        const deleteCoupon = await Coupon.deleteOne({_id:id});
        if(deleteCoupon){
            res.redirect('/admin/couponList')
        }else{
            res.redirect('/admin/couponList')
        }

    }catch(err){
        next(err)
    }
}



//---------------- USER APPLAY COUPON SECTION START 
const applayCoupon = async(req,res,next)=>{
    try{
        const id = req.session.user_id;
        const couponCode = req.body.code;
        const amount = req.body.amount;
        const userExist = await Coupon.findOne({code:couponCode,user:{$in:[id]}});

        if(userExist){
            res.json({user:true});
        }else{
            const couponData = await Coupon.findOne({code:couponCode});
            if(couponData){
                if(couponData.expiryDate <= new Date()){
                    res.json({date:true});
                }else{
                    await Coupon.findOneAndUpdate({_id:couponData._id},{$push:{user:id}});
                    const perAmount = Math.round((amount * couponData.discountPercentage)/100);
                    const disTotal = Math.round(amount - perAmount);  
                    return res.json({amountOkey:true,disAmount:perAmount,disTotal});
                }
            }

        }
        res.json({invalid:true});
    }catch(err){
        next(err)
    }
}



module.exports ={
    loadCopon,
    addCoupon,
    editCoupon,
    deleteCoupon,
    applayCoupon,
}  