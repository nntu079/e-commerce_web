const localStrategy = require('passport-local').Strategy;
//const bcrypt = require('bcryptjs');
//const fs= require('fs')

// Load User model
//const User = require('../models/User');

connect=require('../config/db')
var mysql = require('mysql');

const bcrypt = require('bcrypt');

const conn = mysql.createConnection(connect);


  //connect to database
conn.connect((err) => {
    if(err) throw err;
    console.log('Passport Connected...');
});


module.exports = function (passport) {
    passport.use('user',
        new localStrategy(
            (username, password, done) => {
                /*
                fs.readFile('./model/userDB.json', (err, data) => {
                    const db = JSON.parse(data);
                    const userRecord = db.find(user => user.usr == username)
                    console.log(userRecord)
                    if (userRecord && userRecord.pwd == password) {
                        return done(null, userRecord)
                    } else {
                        return done(null, false)
                    }
                })
                */
                return conn.query(`select username, password,role,lock_account from User where username ='${username}' and delete_account='0' ;`, function (err, result) {
                    if (err) {
                        console.log("error running query");
                        return done(null, false)
                    }
                    console.log('select OK');
                    //console.log(result[0].lock_account );
                    //console.log(result[0].password)
                    if (result.length != 1) {
                        //console.log('Sai tk')
                        return done(null, false,{message: "Sai tài khoản hoặc mật khẩu!"});
                    }
                    else if(result[0].lock_account ==1){
                        return done(null, false,{message: "Tài khoản đã bị khóa, vui lòng liên hệ điểm giao dịch gần nhất"});
                    }
                    else if(result[0].role != 0){
                        //console.log('Dang nhap lon cho roi cu');
                        return done(null, false,{message: "Tài khoản này không phải của user"})
                    }
                    else {
                        //console.log('check thong tin ok');
                            bcrypt.compare(password, result[0].password, function(err, res) {
                              if(res) {
                               
                                rs = {
                                    username: result[0].username,
                                    password: result[0].password,
                                    role: result[0].role
                                }
                                
                                return done(null, rs,{message: "Sai tài khoản hoặc mật khẩu!"})

                              } else {
                                    return done(null, false,{message: "Sai tài khoản hoặc mật khẩu!"});
                              } 
                            });
                    }
                })
            })

    )

    passport.use('seller',
    new localStrategy(
        (username, password, done) => {
            /*
            fs.readFile('./model/userDB.json', (err, data) => {
                const db = JSON.parse(data);
                const userRecord = db.find(user => user.usr == username)
                console.log(userRecord)
                if (userRecord && userRecord.pwd == password) {
                    return done(null, userRecord)
                } else {
                    return done(null, false)
                }
            })
            */
            return conn.query(`select username, password,role from User where username ='${username}' ;`, function (err, result) {
                if (err) {
                    console.log("error running query");
                    return done(null, false)
                }
                //console.log('select OK');
                //console.log(result[0].password)
                if (result.length != 1) {
                    //console.log('Sai tk')
                    return done(null, false)
                }
                else if (result[0].password != password) {
                    //console.log('Sai mk')
                    return done(null, false)
                }
                else if(result[0].role != 1){
                    //console.log('Cho nay danh cho seller nha')
                    return done(null, false)
                }
                else {
                    //console.log('check thong tin ok');

                    rs = {
                        username: result[0].username,
                        password: result[0].password,
                        role: result[0].role
                    }
                    //console.log(rs);
                    return done(null, rs)
                }
            })
        })

)


    passport.use('admin',
    new localStrategy(
        (username, password, done) => {
            /*
            fs.readFile('./model/userDB.json', (err, data) => {
                const db = JSON.parse(data);
                const userRecord = db.find(user => user.usr == username)
                console.log(userRecord)
                if (userRecord && userRecord.pwd == password) {
                    return done(null, userRecord)
                } else {
                    return done(null, false)
                }
            })
            */
            return conn.query(`select username, password,role from User where username ='${username}' ;`, function (err, result) {
                if (err) {
                    console.log("error running query");
                    return done(null, false)
                }
                //console.log('select OK');
                //console.log(result[0].password)
                if (result.length != 1) {
                    //console.log('Sai tk')
                    return done(null, false)
                }
                else if (result[0].password != password) {
                    //console.log('Sai mk')
                    return done(null, false)
                }
                else if(result[0].role != 2){
                    //console.log('Cho nay danh cho seller nha')
                    return done(null, false)
                }
                else {
                    //console.log('check thong tin ok');

                    rs = {
                        username: result[0].username,
                        password: result[0].password,
                        role: result[0].role
                    }
                    //console.log(rs);
                    return done(null, rs)
                }
            })
        })

)


    passport.serializeUser((rs, done) => {
        //console.log('ma hoa ok')
        //console.log(rs);
        done(null, rs.username);
    })

    passport.deserializeUser((name, done) => {
        return  conn.query(`select username,password,role from User where username ='${name}' ;`, function (err, result) {
                if (err) {
                    console.log("error running query");
                    return done(null, false)
                }
                //console.log('select OK');
                //console.log(result[0].password)
                if (result.length != 1) {
                    return done(null, false)
                }
                else {
                    /*
                    return {
                        usr: result[0].username,
                        pwd: result[0].password,
                        role: result[0].role
                    };
                    */
                    //console.log('giai ma ok')
                    rs = {
                        username: result[0].username,
                        password: result[0].password,
                        role: result[0].role
                    }
                    //console.log(name);
                    return done(null, rs)
                }
            }
            )
        })
};