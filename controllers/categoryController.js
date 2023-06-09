const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const upperCase = require('upper-case');
let message = '';


// ----------- category view section
const loadCategory = async (req, res) => {
  try {
    const adminData = await User.findById(req.session.auser_id);  
    const categoryData = await Category.find({is_delete:false});
    res.render('categoryList', { admin: adminData, activePage: 'categoryList', category: categoryData, message: message || '' });
  } catch (error) {
    console.log(error.message);
    res.render('categoryList', { message: message || '' });
  }
};



// ---------- Category data storing section  
const insertCategory = async (req, res) => {
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
  } catch (error) {
    console.log(error.message);
    message = 'something went wrong';
    res.redirect('/admin/categoryList');
  }
};



//  ------------- Edit category section
const editCategory = async (req, res) => {
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
  } catch (error) {
    console.log(error.message);
  }
};



//  --------------- Update category section
const updateCategory = async (req, res) => {
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
  } catch (error) {
    console.log(error.message);
    message = 'something went wrong';
    res.redirect('/admin/categoryList');
  }
};



//-------------- Delete category section
let deleteCategory = async (req, res) => {
  try {
    const id = req.query.id; // Use req.params.id to retrieve the category ID
    const category =   await Category.updateOne({ _id: id }, { $set: { is_delete: true } });
    res.redirect('/admin/categoryList');
  } catch (error) {
    console.log(error.message);
  }
}



module.exports = {
  loadCategory,
  insertCategory,
  editCategory,
  updateCategory,
  deleteCategory,
};

