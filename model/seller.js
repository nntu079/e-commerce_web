connect=require('../config/db')
var mysql = require('mysql');

const conn = mysql.createConnection(connect);


//connect to database
conn.connect((err) => {
    if(err) throw err;
    console.log('Seller Connected...');
});


const add_product_post =  (req, res) =>{  
    if (req.isAuthenticated('seller')) {
        name=req.body.name;
        price=req.body.price;
        old_price=req.body.old_price;
        star=req.body.star;
        type=req.body.type;
        id_seller=req.user.username;
        supplier=req.body.supplier;
        detail=req.body.detail;
        url_image_1=req.files[0].filename;
        url_image_2=req.files[1].filename;
        url_image_3=req.files[2].filename;
        state=req.body.state;

        console.log(supplier)

        console.log(state)
        //console.log(id_seller)
        console.log(url_image_1)
        console.log(url_image_2)
        console.log(url_image_3)
        const sql = `insert into Product (name,price,old_price,star,type,id_seller,supplier,detail,url_image_1,url_image_2,url_image_3,state) values ('${name}','${price}','${old_price}','${star}','${type}','${id_seller}','${supplier}','${detail}','${url_image_1}','${url_image_2}','${url_image_3}','${state}')`;
        
         conn.query(sql, (error, results) => {
            if (error) {
                throw error
            }
            //console.log('atttas');
             res.redirect('/seller/product_manage')
        }) 

    }
    else{
        //console.log('abc');
        res.redirect('/')
    }
};



const get_seller_profile =  (req, res) =>{  
  if (req.isAuthenticated('seller')) {
      const sql = `select * from User where username ='${req.user.username}'`;

      conn.query(sql, (error, results) => {
          if (error) {
              throw error
          }
          seller = results[0];

          const sql_prize = `SELECT name FROM Prize WHERE id_seller='${req.user.username}'`;
          conn.query(sql_prize, (error, results) => {
              if (error) {
                    res.render('./seller/profile/profile',{
                      username:seller.username,
                      full_name:seller.full_name,
                      email: seller.email,
                      phone: seller.phone,
                      address: seller.address,
                      id_card: seller.id_card,
                      tax_code: seller.tax_code,
                  })
              }
              
              seller_prizes = results;

              res.render('./seller/profile/profile',{
                username:seller.username,
                firstname: seller.full_name,
                full_name:seller.full_name,
                email: seller.email,
                phone: seller.phone,
                address: seller.address,
                id_card: seller.id_card,
                tax_code: seller.tax_code,
                prizes: seller_prizes,
              })
          })
      
      }) 
  } else{
      res.redirect('/seller/login')
  }
};

const product_manage_Loader = (req,res) => {
  if (req.isAuthenticated('seller')){
    
    const sql = `SELECT * FROM Product 
                WHERE id_seller = '${req.user.username}'`;
    conn.query(sql, (error, results) => {
      if (error) {
          throw error
      }

      var status_str = '';
      
      for(var i=0;i<results.length;i++) 
      {
          var stt = results[i].product_status;

          if (stt == 0){
            status_str = 'Đang kiểm duyệt';       //chưa được kinh doanh, phải đợi admin chấp thuận
          } else if (stt == 1){
            status_str = 'Đang kinh doanh';       //nếu hết hàng thì vẫn là đang kinh doanh, chỉ là do tạm thời hết hàng nên chưa bán tiếp
          } else if (stt == 2){
            status_str = 'Ngừng kinh doanh';      //chấm dứt việc kinh doanh mặt hàng này (cho đến khi được mở lại)
          }
          results[i].status = status_str;
      }
      
      console.log(results)
      res.render('./seller/product_manage/product_manage', {
          product: results,  
      })
  })

  } else {
    res.redirect('/seller/login');
  }
}




module.exports = {
    add_product_post,
    get_seller_profile,
    product_manage_Loader
}


