
require('dotenv').config();
const connectDB = require('./db');
const { app } = require('./app');


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
