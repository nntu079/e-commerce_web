const express = require('express');
const router = express.Router();

const passport = require('passport');

const sellerDB = require('../../model/seller.js')

/////////////middle ware add product////////////////
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/data')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage });

router.post('/add_product', upload.array('photos', 3),sellerDB.add_product_post);
//////////////////////////////////////////////////////


router.get('/loginOK', (req, res) => {
  if (req.isAuthenticated('seller')) {
    res.render('./seller/profile/profile')
  }
  res.render('./seller/login/login')
});


router.post('/login',
  passport.authenticate('seller', { 
    successRedirect: '/seller/loginOK',
    failureRedirect: '/seller/login',
    failureFlash: true
  })
);

router.get('/add_product',(req,res)=>{
  res.render('./seller/add_product/add_product2')
})



router.get('/feedback',(req,res)=>{
  res.render('./seller/feedback/feedback')
})

router.get('/login',(req,res)=>{
  res.render('./seller/login/login')
})

router.get('/product_manage',(req,res)=>{
  res.render('./seller/product_manage/product_manage')
})

router.get('/profile',(req,res)=>{
  res.render('./seller/profile/profile')
})

router.get('/statistic',(req,res)=>{
  res.render('./seller/statistic/statistic')
})


module.exports = router;