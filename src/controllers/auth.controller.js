const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../models/blackList.model");

/**
* - user register controller
* - POST /api/auth/register
*/

async function userRegisterController(req,res){

    const {email,password, name} = req.body;

    const isExists = await userModel.findOne({
        email:email
    })
    
    if(isExists){
        return res.status(409).json({
            message:"User already exists",
            status:"failed"
        })
    }

    const user = await userModel.create({
        email,
        password,
        name
    })

    const token = jwt.sign(
        { userId:user._id },
        process.env.JWT_SECRET,
        { expiresIn:"3d" }
    )

    res.cookie("token", token)

    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token,
        message:"User registered successfully",
        status:"success"
    })

    await emailService.sendRegistrationEmail(user.email, user.name);

}

/**
 * - user login controller
 * - POST /api/auth/login
*/

async function userLoginController(req,res) {
    const {email,password} = req.body;

    const user = await userModel.findOne({ email }).select("password")

    if(!user){
        return res.status(401).json({
            message:"User with this email not found",
            status:"failed"
        })
    }

    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword){
        return res.status(401).json({
            message:"Invalid credentials",
            status:"failed"
        })
    }

    const token = jwt.sign(
        { userId:user._id },
        process.env.JWT_SECRET,
        { expiresIn:"3d" }
    )

    res.cookie("token", token)

    res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token,
        message:"User Logged in successfully",
        status:"success"
    })

}

/**
 * - user logout controller
 * - POST /api/auth/logout
 * - Invalidate the token by adding it to the blacklist
 * - Clear the token cookie
*/
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Token not found" });
    }

    // Add token to blacklist
    await tokenBlackListModel.create({ token });

    // Clear the token cookie
    res.clearCookie("token");

    res.status(200).json({ message: "User logged out successfully" });
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}