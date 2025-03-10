
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

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



// Import Router
const userRouter  = require("./routes/user.routes");


// routes declaration
app.use("/api/v1/users",userRouter)


module.exports = {app};
