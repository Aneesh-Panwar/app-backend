const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary.service");
const jwt = require("jsonwebtoken")

const generateTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false});

        return{accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"failed to generate tokens "+error.message);
    }
}

// user - controllers
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
    // console.log(req.files);

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

const loginUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body;

    if(!(username || email)) throw new ApiError(400,"username or email required");

    const user = await User.findOne({
        $or:[{email},{username}]
    })

    if(!user) throw new ApiError(404,"user does not exist")
    
    if(! (await user.isPasswordCorrect(password)))  throw new ApiError(401,"Invalid user crendentials")

    const {accessToken,refreshToken} = await generateTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // console.log(loggedInUser);

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{loggedInUser,accessToken,refreshToken},"logged in successfully"))
})

const logoutUser = asyncHandler(async(req,res)=>{
    
    await User.findByIdAndUpdate(req.user._id,{
        $unset:{
            refreshToken:""
        },
    },{new:true})

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"));
})

const refreshAccessToken = asyncHandler(async(req,res)=>{

    const incomingToken = req.body.refreshToken || req.cookies.refreshToken

    if(!incomingToken) throw new ApiError(401,"Unauthorized request");

    try {
        const decode = jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decode._id);
        if(!user|| user.refreshToken !== incomingToken) throw new ApiError(401,"Invalid or Expired refreshToken");
    
        const {accessToken,refreshToken} = await generateTokens(decode._id);
        const options = {
            httpOnly:true,
            secure:true
        }
    
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(200,{accessToken,refreshToken},"access token refreshed"))
    } catch (error) {
        throw new ApiError(401,error?.message);
    }
})

const changePassword = asyncHandler(async(req,res)=>{

    const {oldPassword,newPassword} = req.body

    const user = await User.findById(req.user?._id)
    if(!await user.isPasswordCorrect(oldPassword)) throw new ApiError(401,"Incorrect old password");

    user.password = newPassword;
    await user.save({validateBeforeSave:true});

    return res.status(200).json(new ApiResponse(200,{},"password changed"))
    
})

const updateAccount = asyncHandler(async(req,res)=>{

    const {fullname,email} = req.body

    if(!(fullname || email)) throw new ApiError(400,"all fields required");

    const user = await User.findByIdAndUpdate(req.user._id,
        {$set:{fullname,email}},{new:true}
    ).select("-password refreshToken")

    return res.status(200).json(new ApiResponse(200,user,"user details updated"))
})

const updateUserAvatar = asyncHandler(async(req,res)=>{

    
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    updateAccount,
}