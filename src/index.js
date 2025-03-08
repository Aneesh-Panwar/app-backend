
require('dotenv').config();
const cors = require("cors");
const express = require("express");
const connectDB = require('./db');
const cookieParser = require("cookie-parser");
const { app } = require('./app');

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: '20kb'}))

// to get data from differnet type of url's
app.use(express.urlencoded({extended: true,limit: '20kb'}))

// to use public assets
app.use(express.static("public"))

// to access(CRUD) the cookies of user browser 
app.use(cookieParser());

// ify function data base connection using async-await
/*
;(async()=>{
    try{
        await mongoose.connect(`${process.env.DBURL}/${DB_NAME}`)
        app.on("error",(err)=>{
            console.log("error to connect",err);
        })
        app.listen(process.env.PORT,()=>{
            console.log("DB connected .... \napp listennig");
        })
    }catch(err){
        console.log("MONGO-DB connection FAILED : ",err);
        throw err;
    }
})();
*/


// this func also returns a Promise so then works fine
connectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`SERVER is running at PORT  : ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log("error to connect",err);
})