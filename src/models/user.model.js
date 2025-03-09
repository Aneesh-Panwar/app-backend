const {Schema,model} = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


let userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String, // cloudnary url
        required: true,
    },
    coverImage:{
        type: String, // cloudnary url
    },
    watchHistory:{
        type: Schema.Types.ObjectId,
        ref: "Vidoe"
    },
    password:{
        type: String,
        required: [true, "password required"]
    },
    refreshToken:{
        type: String
    }
}, {timestamps: true});


// pre middleware lets us perform some task before a specific event like "save"...
// function() is used instead ()=>{} so that we can get "this" inside function ...
userSchema.pre("save", async function(next){

    if(! this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next();
})

// "methods" lets us create our own function for the Schema 'instance' ...
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function () {

    return jwt.sign({
        _id:this._id,
        email: this.email,
        username: this.username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
}
userSchema.methods.generateRefreshToken = function () {

    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
}

const User = model("User",userSchema);
