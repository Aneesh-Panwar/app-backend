const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary.service");


const registerUser = asyncHandler(async(req,res)=>{

    const {fullname,email, username , password} = req.body

    if([fullname,username,email,password].some(field => field?.trim() === undefined || field?.trim() === "")){
        throw new ApiError(400, "All fields are required..")
    }

    const userExists = await User.findOne({
        $or : [{email},{username}]
    })

    if(userExists){
        throw new ApiError(409,"user already exists");
    }

   // if file are there will be stored locally by multer
    const avatarLocalpath = req.files?.avatar?.[0]?.path;
    const coverImageLocalpath = req.files?.coverImage?.[0]?.path;
    

    if(!avatarLocalpath) throw new ApiError(400,"avatar file required")
    
    // if they were then will bw stored on cludinary
    const avatar = await uploadOnCloudinary(avatarLocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)

    if(!avatar) throw new ApiError(400,"avatar file required")
    
    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })     
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) throw new ApiError(500,"Error while rgistering user")

    
    return res.status(201).json(new ApiResponse(200,createdUser,"user registered successfully"))
})

module.exports = {registerUser}