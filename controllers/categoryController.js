const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const upperCase = require('upper-case');


let message = '';



//---------------- ADMIN CATEGORYLIST SHOWING SECTION START
const loadCategory = async (req, res,next) => {
  try {
    const adminData = await User.findById(req.session.auser_id);  
    const categoryData = await Category.find({is_delete:false});


    const page = parseInt(req.query.page) || 1; 
    const limit = 20; 
    const startIndex = (page - 1) * limit; 
    const endIndex = page * limit; 
    const categoryCount = categoryData.length;
    const totalPages = Math.ceil(categoryCount / limit); 
    const paginatedCategory = categoryData.slice(startIndex, endIndex); 
    
    res.render('categoryList', 
    { 
      admin: adminData,
      activePage:'categoryList',
      category:categoryData, 
      category: paginatedCategory, 
      currentPage: page,
      totalPages: totalPages,
      message: message || '' 
    });
  } catch (err) {
    next(err)
  }
};



//---------------- ADMIN CATEGORYLIST INSERTING SECTION START 
const insertCategory = async (req, res,next) => {
  try {
    const name = upperCase.upperCase(req.body.name.trim());
    const existingCategory = await Category.findOne({ categoryName: name });
    const reupdate = await Category.updateOne({ categoryName: name },{$set:{is_delete:false}});
    if (existingCategory) {
      message = 'category is already exists';
      res.redirect('/admin/categoryList');
      return;
    }

    const category = new Category({
      categoryName: name,
    });

    const categoryData = await category.save();

    if (categoryData) {
      message = 'category is added';
      res.redirect('/admin/categoryList');
    } else {
      message = 'Something went wrong';
      res.redirect('/admin/categoryList');
    }
  } catch (err) {
    next(err)
  }
};



//---------------- ADMIN CATEGORYLIST EDITING SECTION START
const editCategory = async (req, res,next) => {
  try {
    const id = req.params.id;
    const adminData = await User.findById(req.session.auser_id);
    const categoryData = await Category.findById(id);
    if (categoryData) {
      res.render('categoryList', {
        category: categoryData,
        admin: adminData,
        message: message || ''
      });
    } else {
      res.redirect('/admin/categoryList');
    }
  } catch (err) {
    next(err)
  }
};



//---------------- ADMIN CATEGORYLIST UPDATING  SECTION START
const updateCategory = async (req,res,next) => {
  try {
    const id = req.body.id;
    const updatedCategoryName = upperCase.upperCase(req.body.categoryName.trim());
    const existingCategory = await Category.findOne({ categoryName: updatedCategoryName, _id: { $ne: id } });
    if (existingCategory) {
      message = 'category already exists';
      res.redirect('/admin/categoryList');
      return;
    }
    const category = await Category.findByIdAndUpdate(id, { categoryName: updatedCategoryName });
    if (category) {
      message = 'category updated successfully';
      res.redirect('/admin/categoryList');
    } else {
      message = 'failed to update category';
      res.redirect('/admin/categoryList');
    }
  } catch (err) {
    next(err)
  }
};



//---------------- ADMIN CATEGORYLIST DELETING SECTION START
let deleteCategory = async (req, res,next) => {
  try {
    const id = req.query.id;
    const category =   await Category.updateOne({ _id: id }, { $set: { is_delete: true } });
    res.redirect('/admin/categoryList');
  } catch (err) {
    next(err);
  }
}



module.exports = {
  loadCategory,
  insertCategory,
  editCategory,
  updateCategory,
  deleteCategory,
};

