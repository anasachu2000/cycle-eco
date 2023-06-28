const Banner = require('../models/bannerModel');
const User = require('../models/userModel');


const loadBanner = async (req,res,next) =>{
    try{
        const adminData = await User.findById(req.session.auser_id);
        const bannerData = await Banner.find();
        res.render('bannerList',{admin:adminData, activePage:'bannerList',banner:bannerData})

    }catch(err){
        next(err)
    }
}


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

module.exports = {
    insertBanner,
    loadBanner,
}