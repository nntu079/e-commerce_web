const express = require('express');
const router = express.Router();

// Đã đăng nhập
router.get('/', (req, res) => {
  res.redirect('/user')
});



module.exports = router;