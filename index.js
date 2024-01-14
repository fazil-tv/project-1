
const express = require("express");
const app = express();
const nocache =require ("nocache");
const session = require("express-session");
const morgan = require("morgan");
const config = require('./config/config');

require('dotenv').config();
const PORT = process.env.PORT


//session management
app.use(session({
    secret:config.sessionSecretKey,
    saveUninitialized: true,
    resave: false
  }))

//using morgan middleware for logging HTTp requests
// app.use(morgan('dev'));


//connect to mongodb 
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURL);

//check
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () =>console.log('Connected to the database!'));


app.use(express.static('public'));

// ejs
app.set('view engine','ejs')
app.set('views','./views/user')

app.use(nocache())

app.use(express.json())
app.use(express.urlencoded({extended:true}))

 
const userRoute = require('./routes/userRoute')
app.use('/',userRoute)


const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)




app.listen(PORT,()=>console.log("server started http://localhost:5000"));
