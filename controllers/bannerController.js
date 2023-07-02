const Banner = require('../models/bannerModel');
const User = require('../models/userModel');



//---------------- ADMIN BANNER SHOWING SECTION START
const loadBanner = async (req,res,next) =>{
  try{
      const adminData = await User.findById(req.session.auser_id);
      const bannerData = await Banner.find();
      res.render('bannerList',{admin:adminData, activePage:'bannerList',banner:bannerData})

  }catch(err){
      next(err)
  }
}



//---------------- BANNER DATA INSERTING SECTION START
const insertBanner = async (req, res) =>{
  try {
    const heading = req.body.text
    let image ='';
    if(req.file){
      image = req.file.filename
    }
    const banner = new Banner({
      heading:heading,
      image:image
    })
    await banner.save()
    res.redirect("/admin/bannerList")
  } catch (error) {
    console.log(error.message);
  }
}


const editBanner = async (req,res,next) =>{
  try {
    const id = req.body.id
    const heading = req.body.heading
    let image = req.body.img

    if(req.file){
      image = req.file.filename
    }
    await Banner.findOneAndUpdate({_id:id},{
      $set:{
        heading:heading,
        image:image
      }
    })
    res.redirect("/admin/bannerList")
  } catch (error) {
    next(error);
  }
}


module.exports = {
  insertBanner,
  loadBanner,
  editBanner,
}