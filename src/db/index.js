let mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const connectDB = async()=>{
    try{
        const connInstance = await mongoose.connect(`${process.env.DBURL}/${DB_NAME}`);
        console.log(`DATABASE CONNECTED..!! HOST: ${connInstance.connection.host}`);
        // console.log(connInstance);
    }catch(err){
        console.log("MONGO-DB connection FAILED : ",err);
        process.exit(1); 
    }
}

module.exports = connectDB;