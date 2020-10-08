connect=require('../config/db')
var mysql = require('mysql');

var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


const create_payment_Function = (req, res) => {
    const sql = `CALL MoveCartToOrder('${req.user.username}');`
    conn.query(sql, function (err, result) {
        if (err) 
            res.send(err);    
        res.redirect('/user/orders')
    });
}


const order_detail = (req, res) => {
    if (req.isAuthenticated('user')) {
        const sql = `SELECT * FROM Orders
                where Orders.id_payment='${req.params.paymentID}'`;

        conn.query(sql, (error, results) => {
            if (error){
                throw error;
            }

            var details = results[0]
            console.log(results)
            if (details.payment_type == 1){
                details.payment_type2 = "Thanh toán khi nhận hàng";
            } else if (details.payment_type == 2) {
                details.payment_type2 = "Thanh toán online";
            }
            
            //  for(var i=0;i<results.length;i++){
            //         if(results[i].state==0){
            //             results[i].state2="Đang giao";
            //         }
            //         else{
            //             results[i].state2="Hoàn tất";
            //         }
            //     }

                //query lần 2 : lấy dữ liệu cụ thể như danh sách các product
            const sql_products = `SELECT * FROM Order_Product JOIN Product
                on Product.id = Order_Product.id_product
                where Order_Product.id_payment='${req.params.paymentID}'`;

            conn.query(sql_products, (error, results) => {
                if (error){
                    throw error;
                }

                products = results;

                res.render('./user/order_detail/order_detail',{
                    id_payment: req.params.paymentID,
                    detail: details,
                    product: products,
                    firstname:req.user.username
                })
            }) 
        })
    }
    else{
        //console.log('abc');
        res.redirect('/')
    }
}



const getProductInforToAccept=(req,res,next)=>{
     

        if (req.isAuthenticated('admin')) {
        const sql = `select * from Product where product_status = '0'`;
         conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.send(result)
        });
    }
};

const getSize=(req,res,next)=>{

        const sql = `select count(*) as size from Product where  product_status = '1'`;
         conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.status(200).send(result);
        });
};

const acceptProduct=(req,res,next)=>{
        if (req.isAuthenticated('admin')) {
        const sql = `update Product set product_status ='1' where id = '${req.params.id}'`;
        conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.send(result)
        });
    }
};

const disAcceptProduct=(req,res,next)=>{
        if (req.isAuthenticated('admin')) {
        const sql = `DELETE FROM Product where id = '${req.params.id}'`;
        conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.send(result)
        });
    }
};

const unblockUser=(req,res,next)=>{
    if (req.isAuthenticated('admin')) {
        const sql = `update User set lock_account ='0' where username='${req.params.username}'`;
        conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.send(result)
        });
    }
}

const blockUser=(req,res,next)=>{
    if (req.isAuthenticated('admin')) {
        const sql = `update User set lock_account ='1' where username='${req.params.username}'`;
        conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.send(result)
        });
    }
}




const payment=(req,res,next)=>{
        if (req.isAuthenticated('user')) {
        const sql = `INSERT INTO Orders (username, id_product, quantity)
                    SELECT id_user, id_product, quantity
                    FROM Shopping_cart
                    WHERE  id_user='${req.user.username}' `;
        conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            
            const sql2=`DELETE FROM Shopping_cart
                        WHERE id_user='${req.user.username}' `;
            conn.query(sql2, function (err2, result2) {
            if (err2) 
                res.send(err2);
            const sql3=`UPDATE
                            Orders,
                            Product
                        SET
                            Orders.amount = Orders.quantity* Product.price
                        WHERE
                            Orders.id_product = Product.id and Orders.username= '${req.user.username}'`

                             conn.query(sql3, function (err3, result3) {
                                if (err3) 
                                    res.send(err3);    
                                res.redirect('/user/orders')
                                });


            });
        });
        
    }
};




const option = {
    service: 'gmail',
    auth: {
        user: 'nntu079@gmail.com', 
        pass: 'studymath'
    }
};



const conn = mysql.createConnection(connect);


conn.connect((err) => {
    if(err) throw err;
    console.log('User Connected...');
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function deleteCode(username){
    const sql = `update User set code ='0' where username='${username}'`;
         conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            console.log('reset code OK');
    });

}

const reset_passwordAPI=(req,res,next)=>{
    

        code =parseInt(getRandomArbitrary(1000,9999));

        const sql = `update User set code ='${code}' where username='${req.params.username}'`;

        conn.query(sql, (error, result) => {
            if (error) {
                res.send(error);
            }
            //console.log('atttas');
            res.end('Sending code');


            const sql = `select * from User where username ='${req.params.username}'`;
             conn.query(sql, (error, results) => {
                if (error) {
                    throw error
                }

                transporter = nodemailer.createTransport(option);
                 transporter.verify(function(error, success) {
                    // Nếu có lỗi.
                    if (error) {
                        //console.log(error);
                        return -1;
                    } else { //Nếu thành công.
                        
                        console.log('Kết nối thành công!');
                        var mail = {
                            from: 'nntu079@gmail.com', 
                            to: results[0].email.toString(), 
                            subject: 'Yêu cầu lấy lại mật khẩu', 
                            text: code.toString() +'\n'+'Bạn có 5 phút nhập code', 
                        };
                        
                            transporter.sendMail(mail, function(error, info) {
                                if (error) { 
                                    console.log(error);
                                    return -1;
                                } else { 

                                        console.log('Email sent: ' + info.response);
                                       setTimeout(function(){
                                                const sql = `update User set code ='0' where username='${req.params.username}'`;
                                                 conn.query(sql, function (err, result) {
                                                    if (err) 
                                                        res.send(err);
                                                    console.log('reset code OK');
                                             });
                                        }, 1000*60*5)
                                    
                                }
                            });
                    }
                });

                
            }) 
        }) 
    
};

const reset_passwordAPI2=(req,res,next)=>{

     if(req.params.code!='0'){

        const sql = `select * from User where username ='${req.params.username}'`;
        
        conn.query(sql, (error, results) => {
            if (error) {
                console.log(error)
            }
            //console.log('atttas');
            if(results.length==0){
                res.end('0');
            }
            else if(req.params.code==results[0].code){

                    bcrypt.hash(req.params.newPass, 10, function(err, hash) {
                      
                      // Store hash in database


                      const sql = `update User set password ='${hash}' where username ='${req.params.username}'`;
                     conn.query(sql, (error, results) => {
                        if (error) {
                            console.log(error)
                        }
                        res.end('1');
                        
                        
                          setImmediate(function(){
                                                    const sql = `update User set code ='0' where username='${req.params.username}'`;
                                                     conn.query(sql, function (err, result) {
                                                        if (err) 
                                                            console.log(err)
                                                        console.log('reset code OK');
                                                 });
                                            })
                             }) 
                        });



                
            }
            else{
                res.end('2');
            }
            
        }) 
    }
    else{
        res.redirect('/err')
    }
    
};

const sign_up_Function = (usr, pass, email, phone, callback) =>
{
    bcrypt.hash(pass, 10, function(err, hash) {
        
        const sql = `INSERT INTO 
        User (username, password, full_name, email, phone, address, id_card, tax_code, lock_account, role) 
        VALUES ('${usr}', '${hash}', NULL, '${email}', '${phone}', NULL, '0', '0', '0', '0')`;

    conn.query(sql, (error, results) => {
        if (error) {
            throw error;
        } else {
            console.log(results);
            callback();
        }
    });
    });
};

const getUserProfile =  (req, res) =>{  
    if (req.isAuthenticated('user')) {
        const sql = `select * from User where username ='${req.user.username}'`;

        conn.query(sql, (error, results) => {
            if (error) {
                throw error
            }
            //console.log('atttas');
            res.render('./user/profile/profile',{
                username:results[0].username,
                firstname:results[0].full_name,
                lastname_firstname:results[0].full_name,
                email: results[0].email,
                phone: results[0].phone
            })
        }) 
    }
    else{
        //console.log('abc');
        res.redirect('/err')
    }
};


var LIMIT=9;
var PAGE=0;

const userHomePageLimit= (req,res)=>{

    let limit1=LIMIT;
    let page1=req.params.page;

    let offset1=limit1*page1

       role=-1;
        if (req.isAuthenticated('user')){
            role=req.user.role;
        }
    
    if (req.isAuthenticated('user') && role==0) {
        const sql = `select * from Product where product_status='1' ORDER BY date_time DESC LIMIT ${LIMIT} OFFSET ${offset1}`;
        conn.query(sql, (error, results) => {
            if (error) {
                throw error
            }
            rank=[];
            not_rank=[];
            
            for(var i=0;i<results.length;i++){
                rank[i]=results[i].star;
                not_rank[i]=5-rank[i];

                results[i].rank=[];
                results[i].not_rank=[];

                for(var j=0;j<rank[i];j++){
                    results[i].rank[j]=1;
                }
                for(var j=0;j<not_rank[i];j++){
                    results[i].not_rank[j]=1;
                }
            }
                
                const sql1 = `select count(*) as size from Product where  product_status = '1'`;
                 conn.query(sql1, function (err, result1) {
                    if (err) 
                        res.send(err);

                     //console.log(results)
                        res.render('./user/homepage/homepage_login',{
                            data:results,
                            max:result1[0].size
                        })
                    
                });
           
        })
        console.log('ki vay ta');
        
    }
    else{
        const sql = `select * from Product where product_status='1' ORDER BY date_time DESC   LIMIT ${LIMIT} OFFSET ${offset1}`;
        conn.query(sql, (error, results) => {
            if (error) {
                throw error
            }
            rank=[];
            not_rank=[];
            //console.log(results[0])

            for(var i=0;i<results.length;i++){
                rank[i]=results[i].star;
                not_rank[i]=5-rank[i];

                results[i].rank=[];
                results[i].not_rank=[];

                for(var j=0;j<rank[i];j++){
                    results[i].rank[j]=1;
                }
                for(var j=0;j<not_rank[i];j++){
                    results[i].not_rank[j]=1;
                }
            }

             const sql1 = `select count(*) as size from Product where  product_status = '1'`;
                 conn.query(sql1, function (err, result1) {
                    if (err) 
                        res.send(err);

                     //console.log(results)
                        res.render('./user/homepage/homepage_not_login',{
                            data:results,
                            max:result1[0].size
                        })
                    
                });
           
           
        })
    }
};

const userHomePage= (req,res)=>{

    OFFSET=PAGE*LIMIT;

    if (req.isAuthenticated('user')) {
        const sql = `select * from Product LIMIT ${LIMIT} OFFSET ${OFFSET}`;
        conn.query(sql, (error, results) => {
            if (error) {
                throw error
            }
            rank=[];
            not_rank=[];
            
            for(var i=0;i<results.length;i++){
                rank[i]=results[i].star;
                not_rank[i]=5-rank[i];

                results[i].rank=[];
                results[i].not_rank=[];

                for(var j=0;j<rank[i];j++){
                    results[i].rank[j]=1;
                }
                for(var j=0;j<not_rank[i];j++){
                    results[i].not_rank[j]=1;
                }
            }
           
            //console.log(results)
            res.render('./user/homepage/homepage_login',{
                data:results,
                
            })
        })
        
    }
    else{
        const sql = `select * from Product  LIMIT ${LIMIT} OFFSET ${OFFSET}`;
        conn.query(sql, (error, results) => {
            if (error) {
                throw error
            }
            rank=[];
            not_rank=[];
            //console.log(results[0])

            for(var i=0;i<results.length;i++){
                rank[i]=results[i].star;
                not_rank[i]=5-rank[i];

                results[i].rank=[];
                results[i].not_rank=[];

                for(var j=0;j<rank[i];j++){
                    results[i].rank[j]=1;
                }
                for(var j=0;j<not_rank[i];j++){
                    results[i].not_rank[j]=1;
                }
            }
           
            //console.log(results)
            res.render('./user/homepage/homepage_not_login',{
                data:results,
                
            })
        })
    }
};

const shopping_cart =  (req, res) =>{  

    role=-1;
        if (req.isAuthenticated('user')){
            role=req.user.role;
        }

    if (req.isAuthenticated('user') && role==0){
        const sql = `select * from Product join Shopping_cart on Product.id=Shopping_cart.id_product where Shopping_cart.id_user ='${req.user.username}'`;

           conn.query(sql, (error, results) => {
                console.log(results)

                    rank=[];
                not_rank=[];
                //console.log(results[0])

                for(var i=0;i<results.length;i++){
                    rank[i]=results[i].star;
                    not_rank[i]=5-rank[i];

                    results[i].rank=[];
                    results[i].not_rank=[];

                    for(var j=0;j<rank[i];j++){
                        results[i].rank[j]=1;
                    }
                    for(var j=0;j<not_rank[i];j++){
                        results[i].not_rank[j]=1;
                    }
                }
                finalPrice=0;
                  for(var i=0;i<results.length;i++){
                    results[i].totalPrice=results[i].price*results[i].quantity;
                    finalPrice=finalPrice+results[i].totalPrice;
                }
                
                res.render('./user/shopping_cart/shopping_cart',{
                    data:results,
                    finalPrice:finalPrice,
                    
                })
            })       
    }
    else{
            res.redirect('/err');
    }
};

const productInfor=(req,res)=>{
    
    username="";
    role=-1;

    if (req.isAuthenticated('user')) {
        role=req.user.role
    }

    if (role==0) {
        username=req.user.username
    }


    const sql = `select * from Product where id ='${req.params.productID}'`;
    conn.query(sql, (error, results) => {
        if (error) {
            throw error
        }
        if(results.length==1){
            res.render('./user/product_infor/product_infor',{
                name:results[0].name,
                url_image_1: results[0].url_image_1,
                url_image_2: results[0].url_image_2,
                url_image_3: results[0].url_image_3,
                id: results[0].id,
                supplier: results[0].supplier,
                star: results[0].star,
                price: results[0].price,
                old_price: results[0].old_price,
                user: username
            })
        }
        else{
            res.redirect('/');
        }
    })
};

const searching=(req,res)=>{

      role=-1;
        if (req.isAuthenticated('user')){
            role=req.user.role;
        }

    if(!req.query.type){
        const sql = `select * from Product where name LIKE '%${req.query.searching}%' and product_status='1' LIMIT 10` ;
        conn.query(sql, (error, results) => {
            if (error) {
                throw error
            }
            if(results.length!=0){
                //console.log(results)
                rank=[];
                not_rank=[];
                //console.log(results[0])

                for(var i=0;i<results.length;i++){
                    rank[i]=results[i].star;
                    not_rank[i]=5-rank[i];

                    results[i].rank=[];
                    results[i].not_rank=[];

                    for(var j=0;j<rank[i];j++){
                        results[i].rank[j]=1;
                    }
                    for(var j=0;j<not_rank[i];j++){
                        results[i].not_rank[j]=1;
                    }
                }
                user="";
                if (req.isAuthenticated('user') && role==0){
                    user=req.user.username;
                }

                res.render('./user/search_result/search_result',{
                    data:results,
                    user:user
                })
            }
            else{
                user="";
                if (req.isAuthenticated('user') && role==0){
                    user=req.user.username;
                }

                res.render('./user/search_result/search_result',{
                    data:results,
                    user:user
                })
                
            }
        })
    }
    else{
         const sql = `select * from Product where type ='${req.query.type}' and product_status='1' LIMIT 10` ;
        conn.query(sql, (error, results) => {
            if (error) {
                throw error
            }
            if(results.length!=0){
                //console.log(results)
                rank=[];
                not_rank=[];
                //console.log(results[0])

                for(var i=0;i<results.length;i++){
                    rank[i]=results[i].star;
                    not_rank[i]=5-rank[i];

                    results[i].rank=[];
                    results[i].not_rank=[];

                    for(var j=0;j<rank[i];j++){
                        results[i].rank[j]=1;
                    }
                    for(var j=0;j<not_rank[i];j++){
                        results[i].not_rank[j]=1;
                    }
                }
                user="";
                if (req.isAuthenticated('user') && role==0){
                    user=req.user.username;
                }

                res.render('./user/search_result/search_result',{
                    data:results,
                    user:user
                })
                
            }
            else{
                user="";
                if (req.isAuthenticated('user') && role==0){
                    user=req.user.username;
                }

                res.render('./user/search_result/search_result',{
                    data:results,
                    user:user
                })
            }
        })
        
    }

};

const favorite_product=(req,res)=>{
     role=-1;
        if (req.isAuthenticated('user')){
            role=req.user.role;
        }

        if (req.isAuthenticated('user') && role==0) {
        const sql = `select * from Product join Favorite on Product.id=Favorite.id_product where Favorite.id_user ='${req.user.username}'`;

        conn.query(sql, (error, results) => {
            console.log(results)

                rank=[];
            not_rank=[];
            //console.log(results[0])

            for(var i=0;i<results.length;i++){
                rank[i]=results[i].star;
                not_rank[i]=5-rank[i];

                results[i].rank=[];
                results[i].not_rank=[];

                for(var j=0;j<rank[i];j++){
                    results[i].rank[j]=1;
                }
                for(var j=0;j<not_rank[i];j++){
                    results[i].not_rank[j]=1;
                }
            }
            
            res.render('./user/favorite_product/favorite_product',{
                data:results,
                firstname:req.user.username
            })
        }) 
    }
    else{
        //console.log('abc');
        res.redirect('/')
    }
};


const orders=(req,res)=>{

      role=-1;
        if (req.isAuthenticated('user')){
            role=req.user.role;
        }

        if (req.isAuthenticated('user')&&role==0) {
        const sql = `select * from Orders 
                     where Orders.username ='${req.user.username}'`;
                     
        conn.query(sql, (error, results) => {
            console.log(results)
            
             for(var i=0;i<results.length;i++){
                    if(results[i].state==0){
                        results[i].state2="Đang giao";
                    }
                    else{
                        results[i].state2="Hoàn tất";
                    }
                }

            res.render('./user/orders/orders',{
                data:results,
                firstname:req.user.username
            })
        }) 
    }
    else{
        //console.log('abc');
        res.redirect('/')
    }
};




const delete_favorite_product=(req,res,next)=>{
        if (req.isAuthenticated('user')) {
        const sql = `delete from Favorite where Favorite.id_product ='${req.params.productID}' and Favorite.id_user ='${req.user.username}'`;
         conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.end('Delete OK');
        });
    }
};

const add_favorite_product=(req,res,next)=>{
        if (req.isAuthenticated('user')) {
        const sql = `insert into Favorite (id_user,id_product) values ('${req.user.username}','${req.params.productID}')`;
         conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.end('Insert OK');
        });
    }
};

const addProductToShoppingCart=(req,res,next)=>{
        if (req.isAuthenticated('user')) {
        const sql = `select * from Shopping_cart where id_user ='${req.user.username}' and id_product='${req.params.productID}'`;
         conn.query(sql, function (err, result1) {
            if (err) 
                res.send(err);
            else{
                if(result1.length==0){
                    const sql1 = `insert into Shopping_cart (id_user,id_product,quantity) values ('${req.user.username}','${req.params.productID}','${req.params.quantity}')`;
                    conn.query(sql1, function (err, result) {
                        if (err) 
                            res.send(err);
                        res.end('Add Product to shopping cart OK');
                    });
                }
                else{
                    quantity=parseInt(result1[0].quantity)+parseInt(req.params.quantity);
                    const sql2 = `UPDATE Shopping_cart set quantity='${quantity}' where id_user = '${req.user.username}' and id_product = '${req.params.productID}'
`;
                    conn.query(sql2, function (err, result) {
                        if (err) 
                            res.send(err);
                        res.end('Add Product to shopping cart OK');
                    });
                }
            }
        });
    }
};


const deleteProductToShoppingCart=(req,res,next)=>{
        if (req.isAuthenticated('user')) {
        const sql = `delete from Shopping_cart where id_product ='${req.params.productID}' and id_user ='${req.user.username}'`;
         conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.end('Delete Product to shopping cart OK');
        });
    }
};

const blockUserAPI=(req,res,next)=>{
        if (req.isAuthenticated('user')) {
        const sql = `update User set lock_account ='1' where username='${req.user.username}'`;
         conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.end('Block User OK');
        });
    }
};

const delete_account=(req,res,next)=>{
        if (req.isAuthenticated('user')) {
        const sql = `select * from User where username='${req.user.username}'`;
         conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            console.log(result[0].full_name)
            res.render('./user/delete_account/delete_account',{
                full_name:result[0].full_name
            })
        });
    }
};



const deleteUserAPI=(req,res,next)=>{
        if (req.isAuthenticated('user')) {
        const sql = `update User set delete_account ='1' where username='${req.user.username}'`;
         conn.query(sql, function (err, result) {
            if (err) 
                res.send(err);
            res.end('Delete User OK');
        });
    }
};


const getProductListAPI=(req,res,next)=>{

        page=req.params.page;
        limit=3;
        
        page=page*limit;

        //const sql = `select * from Product  LIMIT ${page},${skip} `;
        const sql = `select * from Product  LIMIT ${limit} OFFSET ${page} `;
         conn.query(sql, function (err, result) {
            res.status(200).send(result);
        });

    
};

const isExistAccountAPI=(req,res,next)=>{

        const sql = `select * from User where username ='${req.params.username}'`;

        conn.query(sql, (error, results) => {
            if (error) {
                res.status(500).send(error);
                res.end()
            }
            //console.log('atttas');
           res.status(200).send(`${results.length}`);
           res.end()
        }) 

};




const getUserInfoAPI=(req,res,next)=>{
        if (req.isAuthenticated('user')) {
        
        const sql = `select * from User where username ='${req.user.username}'`;
           


         conn.query(sql, (error, results) => {
            if (error) 
                res.status(500).send(error);
            
                  bcrypt.compare(req.params.oldPass, results[0].password, function(err, res1) {
                  if(res1) {
                   // Passwords match
                        results[0].checkPass='1';
                        res.status(200).send(results);
                  } else {
                   // Passwords don't match
                        results[0].checkPass='-1';
                        res.status(200).send(results);
                  } 
                });

                
            
           
        }) 
    }
    else{
        res.redirect('/')
    }
};


const render_shopping_cart =  (req, res) =>{  
    if (req.isAuthenticated('user')){

        //query lấy dữ liệu từ DB
        const sql = `SELECT * 
                        FROM Shopping_cart JOIN Product 
                            ON Shopping_cart.id_product = Product.id
                        WHERE Shopping_cart.id_user = '${req.user.username}' and Shopping_cart.quantity>'0'`;

        conn.query(sql, (error, results) => {
            if (error) {
                throw error;
            }
            //làm tiếp tại đây.
            var totalMoney = 0;
            rank=[];
            not_rank=[];
            
            for(var i=0; i < results.length; i++){
                rank[i] = results[i].star;
                not_rank[i] = 5-rank[i];

                results[i].rank=[];
                results[i].not_rank=[];

                for(var j=0;j<rank[i];j++){
                    results[i].rank[j]=1;
                }
                for(var j=0;j<not_rank[i];j++){
                    results[i].not_rank[j]=1;
                }

                //tính tổng tiền cần chi cho sản phẩm này (số lượng * đơn giá)
                results[i].total_price = results[i].quantity * results[i].price;
                totalMoney += results[i].total_price;
            }
            results.precalcMoney = totalMoney;              //tạm tính
            results.totalMoney = Math.floor(totalMoney * 1.1);          //tổng tiền (có thêm VAT)    
           
            console.log(results)
            res.render('./user/shopping_cart/shopping_cart',{
                products : results,  
                precalcMoney: results.precalcMoney,
                totalMoney: results.totalMoney,
                user:req.user.username
            })

        });
        
    }
    else{
        res.redirect('/err');
    }
};



const edit_profile_Function = (usr, fullname, pass, email, phone, newPass = null, callback = null) =>
{
    
    bcrypt.hash(newPass, 10, function(err, hash) {


      var sql1 = `UPDATE User SET full_name = '${fullname}', email = '${email}', phone = '${phone}' `;
        if (newPass != null) {
            sql1 += `, password = '${hash}'`;
        }
        sql1 += `WHERE username = '${usr}' `;

        conn.query(sql1, (error, results) => {
            if (error) {
                throw error;
            } else {
                console.log(results);
                if (callback != null) 
                    callback();
            }
        });
    });

    
}


const increase_quantityAPI=(req,res,next)=>{
        if (req.isAuthenticated('user')) {

        const sql = `UPDATE Shopping_cart SET quantity = quantity + 1 WHERE id_user = '${req.user.username}' and id_product = '${req.params.productID}'`;

         conn.query(sql, (error, results) => {
            if (error) {
                res.status(500).send(error);
            }
            //console.log('atttas');
           res.end('OK');
        }) 
    }
};

const decrease_quantityAPI=(req,res,next)=>{
    if (req.isAuthenticated('user')) {

        const sql = `UPDATE Shopping_cart SET quantity = quantity - 1 WHERE id_user = '${req.user.username}' and id_product = '${req.params.productID}' and quantity > 0`;

         conn.query(sql, (error, results) => {
            if (error) {
                res.status(500).send(error);
            }
            //console.log('atttas');
           res.end('OK');
        }) 
    }
};





module.exports = {
    reset_passwordAPI,
    reset_passwordAPI2,
    render_shopping_cart,
    sign_up_Function,
    edit_profile_Function,
    productInfor,
    searching,
    favorite_product,
    orders,
    userHomePageLimit,
    delete_favorite_product,
    add_favorite_product,
    deleteProductToShoppingCart,
    blockUserAPI,
    deleteUserAPI,
    getProductListAPI,
    isExistAccountAPI,
    getUserInfoAPI,
    decrease_quantityAPI,
    addProductToShoppingCart,
    payment,
    increase_quantityAPI,
    getUserProfile,
    userHomePage,
    shopping_cart,
    delete_account,
    getProductInforToAccept,
    getSize,
    acceptProduct,
    unblockUser,
    disAcceptProduct,
    blockUser,
    create_payment_Function,
    order_detail

}


