const express = require('express');
const router = express.Router();

const passport = require('passport');

const userDB = require('../../model/user.js')

// Đã đăng nhập
router.get('/login', (req, res) => {
  res.render('./user/login/login',{
    message: req.flash('error'),
    //messageS: req.flash('success')
  })
});


//RENDER
router.get('/profile',userDB.getUserProfile)
router.get('/',userDB.userHomePage) 
router.get('/product_infor/:productID',userDB.productInfor) //console.log(req.params.productID)
router.get('/search_result',userDB.searching)
router.get('/favorite_product',userDB.favorite_product)

router.get('/shopping_cart',userDB.shopping_cart)
router.get('/orders',userDB.orders)

//API
router.get('/delete_favorite_product/:productID',userDB.delete_favorite_product)
router.get('/add_favorite_product/:productID',userDB.add_favorite_product)
router.get('/addProductToShoppingCart/:productID/:quantity',userDB.addProductToShoppingCart)
router.get('/deleteProductToShoppingCart/:productID',userDB.deleteProductToShoppingCart)
router.get('/blockUserAPI',userDB.blockUserAPI)
router.get('/deleteUserAPI',userDB.deleteUserAPI)



router.get('/payment',(req,res)=>{
  res.render('./user/payment/payment')
})


router.get('/delete_account',(req,res)=>{
  res.render('./user/delete_account/delete_account')
})

router.get('/register',(req,res)=>{
  res.render('./user/register/register')
})



router.get('/reset_password',(req,res)=>{
  res.render('./user/reset_password/reset_password')
})


router.get('/loginOK', (req, res) => {
  if (req.isAuthenticated('user')) {
    res.render('./user/homepage/homepage_login')
  }
  res.redirect('/user/')
});

router.post('/login',
  passport.authenticate('user', { 
    successRedirect: '/user/loginOK',
    failureRedirect: '/user/login',
    failureFlash: true
  })
);


router.get('/logout',function(req, res){
  req.logout('user');
  res.redirect('/');
})

module.exports = router;