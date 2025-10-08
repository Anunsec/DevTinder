const express = require('express')
const AuthRouter = express.Router()
const User=require('../models/UserSchema')
const validateSignupData=require('../middlewares/validateSignupData')
const bcrypt = require('bcrypt')
const UserAuth=require('../Authentication/userAuth')
const jwt=require('jsonwebtoken')
AuthRouter.post("/signup",validateSignupData,async(req,res)=>{
    try{
       const {firstName,lastName,age,email,password,gender,aboutme,photo} = req.body;
       const password_hash=await bcrypt.hash(password,10)
       const user = new User({
            firstName,lastName,age,email,password:password_hash,gender,aboutme,photo
        }) 
        

        const data = await user.save()
        res.json({message:"Signup sucessfull"})


    }
    catch(err){
        res.status(400).send(err.message)
    }
})

AuthRouter.post("/login",async(req,res)=>{
try {
    const{email,password}=req.body;
    
    const user=await User.findOne({email:email})
    if(!user){
        throw new Error("Invalid Crediantials")
    }
    const password_match = await bcrypt.compare(password,user.password)
    if(!password_match){
        throw new Error("Invalid Crediantials")
    }
    
    const Token=await jwt.sign({_id:user._id},"Anu@123",{expiresIn:"1d"})
     res.cookie("Token",Token)
     res.send("Login successfull")

    
} catch (error) {
    res.status(400).send(error.message)
}

})



// AuthRouter.post("/logout",async(req,res)=>{
//   res.cookie("token", null, {
//     expires: new Date(Date.now()),
//   });
//   res.send("Logout Successful!!");

// })

AuthRouter.post("/logout", UserAuth, (req, res) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies?.Token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "No token provided" });

    // 1️⃣ Add token to blacklist to expire it immediately
    global.tokenBlacklist = global.tokenBlacklist || new Set();
    global.tokenBlacklist.add(token);

    // 2️⃣ Clear cookie on client-side
    res.cookie("Token", null, {
      expires: new Date(0), // expire immediately
    });

    res.status(200).json({ message: "Logout successful. Token expired." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports=AuthRouter