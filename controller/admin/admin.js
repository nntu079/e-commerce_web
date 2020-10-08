const express = require('express');
const router = express.Router();

const passport = require('passport');

const adminDB = require('../../model/admin.js')


// Đã đăng nhập
router.get('/login', (req, res) => {
    res.render('./admin/login',{
      message: req.flash('error'),
      //messageS: req.flash('success')
    })
  });

router.get('/loginOK',adminDB.profile );
router.get('/product',adminDB.product );
router.get('/manageUsers',adminDB.manageUsers );
  
  
  router.post('/login',
    passport.authenticate('admin', { 
      successRedirect: '/admin/loginOK',
      failureRedirect: '/admin/login',
      failureFlash: true
    })
  );


module.exports = router;