const express = require('express');
const UserAuth = require('../Authentication/userAuth');
const profileRouter = express.Router();
const User = require('../models/UserSchema')
const bcrypt = require('bcrypt')


//forgot password ka api banana hai

profileRouter.patch("/update/userid",UserAuth,async(req,res)=>{
try{
const LoggedInUser = req.user
const{_id} = LoggedInUser
const userid =LoggedInUser._id
const user = req.body

const ALLOWED_UPDATES = ["firstName","lastName","skills","photo","aboutme"]
const isUpdate = Object.keys(user).every((k)=>ALLOWED_UPDATES.includes(k))

const update= await User.findByIdAndUpdate(userid,user,{new:true},{runValidators:true})
res.json({message:"user updated successfully"})
}
catch(err){
    res.status(400).send(err.message)
}


})

profileRouter.get("/getuser",UserAuth,async(req,res)=>{
try{
    const LoggedInUser= req.user

    const data = await User.findById(LoggedInUser._id).select("firstName lastName")
    res.json({message:"Profile get successsfully",data:data})

} catch (error) {
    res.status(400).send(error.message)
}

})

profileRouter.put("/forgot/password",UserAuth,async(req,res)=>{
try{
const LoggedInUser=req.user;
const {oldPassword,newPassword}=req.body
console.log("Body received:", req.body);

 if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new passwords are required" });
    }

const isMatch= await bcrypt.compare(oldPassword,LoggedInUser.password)
if(!isMatch){
    throw new Error("OLD password is invalid")
}
const new_password = await bcrypt.hash(newPassword,10)

LoggedInUser.password=new_password;
await LoggedInUser.save()


  res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }


})


module.exports=profileRouter