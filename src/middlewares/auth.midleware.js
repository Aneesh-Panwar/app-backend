const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken")

const varifyJwt = asyncHandler(async(req,res,next)=>{

    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ","")
        if(!token) throw new ApiError(401,"Unauthoized request");
    
        const decode = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        // if(!decode) throw new ApiError(401,"")
        const user = await User.findById(decode._id).select("-password -refreshToken")
        if(!user) new ApiError(401,'Invalid Access Token');
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message)
    }
})

module.exports ={ varifyJwt}