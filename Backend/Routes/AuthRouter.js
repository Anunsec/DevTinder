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




AuthRouter.get("/profile",UserAuth,async(req,res)=>{
try{
    const LoggedInUser= req.user

    const data = await User.findById(LoggedInUser._id).select("firstName lastName")
    res.json({message:"Profile get successsfully",data:data})

} catch (error) {
    res.status(400).send(error.message)
}

})







module.exports=AuthRouter