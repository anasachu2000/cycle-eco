function errorHandler(err, req, res, next) {
   res.render("404"); // Render the 404 EJS page
  }
  
module.exports = errorHandler;