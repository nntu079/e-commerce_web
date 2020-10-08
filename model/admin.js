connect=require('../config/db')
var mysql = require('mysql');

const conn = mysql.createConnection(connect);


//connect to database
conn.connect((err) => {
    if(err) throw err;
    console.log('Admin Connected...');
});

const profile =  (req, res) =>{  
    if (req.isAuthenticated('admin')) {
        res.render('./admin/profile',{
            username: req.user.username
        })
    }
    else{
        //console.log('abc');
        res.redirect('/err')
    }
};

const product=(req,res,next)=>{
        if (req.isAuthenticated('admin')) {
        const sql = `select * from Product where product_status = '0'`;
         conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.render('./admin/products',{
                data:result,
                username: req.user.username
            })
        });
    }else{
        //console.log('abc');
        res.redirect('/err')
    }
};


const manageUsers=(req,res,next)=>{
        if (req.isAuthenticated('admin')) {
        const sql = `select * from User where role = '0'`;
         conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.render('./admin/manageUsers',{
                data:result,
                username: req.user.username
            })
        });
    }else{
        //console.log('abc');
        res.redirect('/err')
    }
};

module.exports = {
  profile,
  product,
  manageUsers
}


