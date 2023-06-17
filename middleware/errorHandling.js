function errorHandler(err, req, res, next) {
    console.log(err); 
  
//    res.render("404"); // Render the 404 EJS page
  }
  
  module.exports = errorHandler;