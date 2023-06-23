const env = require('dotenv')
env.config();


//-----data base connection----------//
const mongoose = require('mongoose');
mongoose.connect(process.env.mongo);


const express = require('express');
const app = express();
const nocache = require('nocache');
const session = require('express-session');
const path = require('path');



//--------public file connection----------//
const publicPath = path.join(__dirname,'public');
app.use(express.static(publicPath));



app.use(session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: true
  }));


app.use(nocache());


app.use(express.urlencoded({extended:true}));
app.use(express.json());


const morgan = require('morgan');
//app.use(morgan('tiny'));


//--------User route-------------//
const userRoutes  = require('./routes/userRoutes')
app.use('/',userRoutes);



//--------Admin routes-----------//
const adminRoutes = require('./routes/adminRoutes')
app.use('/admin',adminRoutes);



app.listen(process.env.port,()=>{
    console.log('server is running')
});