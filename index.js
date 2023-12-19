
const express = require("express");
const app = express();
// const nocache =require ("nocache");
const session = require("express-session");
const router = express.Router();

require('dotenv').config();
const PORT = process.env.PORT

app.use(session({
    secret: "eolooooooo",
    saveUninitialized: true,
    resave: false
  }))


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


app.use(express.json())
app.use(express.urlencoded({extended:true}))

 
const userRoute = require('./routes/userRoute')
app.use('/',userRoute)


const adminRoute = require('./routes/userRoute')
app.use('/',adminRoute)


//mongodb user otp verification model
const userOTPverification = require("./model/userOTPverification")


app.listen(PORT,()=>console.log("server started"));
