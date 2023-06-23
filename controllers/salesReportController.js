const User = require('../models/userModel');



//---------------- ADMIN SALES REPORT SHOWING SECTION START
const loadSalesReport = async (req,res,next) =>{
    try{
        const adminData = await User.findById(req.session.auser_id);  
        res.render('saleReport', { admin: adminData, activePage: 'saleReport'});

    }catch(err){
        next(err)
    }
}



module.exports = {
    loadSalesReport,
}