const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session')
const passport= require('passport')
const flash = require('connect-flash');

const app= express();

// Passport Config
require('./config/passport')(passport);

// static file
app.use(express.static('public'));

//view engine
app.set('views','./views');
app.set('view engine', 'hbs');

//body-parser
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    secret:"abc",
    cookie:{
        maxAge:1000*60*50     
    }
}))

app.use(flash());
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/', require('./controller/index.js'));
app.use('/user',require('./controller/user/user.js'))
app.use('/seller',require('./controller/seller/seller.js'))
app.use('/admin',require('./controller/admin/admin.js'))

app.use("*",function(req,res) {
  res.render('./error/index')
})

const port = 3000;
app.listen(port,()=>console.log(`Server da khoi dong tren port ${port}.\nConnecting database ...`))