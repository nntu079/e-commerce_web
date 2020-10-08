module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      
      console.log('Chưa đăng nhập kìa cu')
      res.redirect('/dashboard');  
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      console.log('Đăng nhập rồi nha cu')
      res.redirect('/dashboard');  
    }
};