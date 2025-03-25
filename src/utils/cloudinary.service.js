const cloudinary = require("cloudinary").v2;
const fs = require("fs");  // file system of node.Js (for file operation)


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
});


const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null

        const uploadResult = await cloudinary.uploader.upload(
           localFilePath,{
            resource_type: "auto"
           }
        )
        fs.unlinkSync(localFilePath) 
        return uploadResult;

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the temp stored file on server if upload fail
        return null;
    }
}

module.exports = uploadOnCloudinary;