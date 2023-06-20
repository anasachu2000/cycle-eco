const Coupon = require('../models/couponModel')
const User = require('../models/userModel');

const loadCopon = async (req,res,next) => {
    try{
        const adminData = await User.findById(req.session.auser_id);
        const couponData = await Coupon.find({});  
        res.render('couponList', { admin: adminData,activePage: 'couponList',coupon:couponData});
    }catch(err){
        next(err)
    }
}



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



const editCoupon = async(req,res,next)=>{
    try {
        const id = req.params.id
        console.log(id);
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



module.exports ={
    loadCopon,
    addCoupon,
    editCoupon,
    deleteCoupon,
}  