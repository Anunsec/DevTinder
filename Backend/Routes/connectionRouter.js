
const express=require('express')
const connectionRouter=express.Router();
const UserAuth=require('../Authentication/userAuth')
const connectionRequest=require('../models/connectionRequest')
const User = require('../models/UserSchema');

connectionRouter.post("/request/send/:status/:userId",UserAuth,async(req,res)=>{
try {
    
   const LoggedInUser=req.user
   const fromUserId=LoggedInUser._id
   const toUserId=req.params?.userId
   const status =req.params?.status
   const connectionRequests=new connectionRequest({
    fromUserId,toUserId,status
})

   const ALLOWED_UPDATES=["interested","ignored"];
   if(!ALLOWED_UPDATES.includes(status)){
    throw new Error("Invalid request")
   }

   const user = await User.findById(toUserId)
   if(!user){
    throw new Error("Invalid user id")
   }
   
   const existing_connection_request=await connectionRequest.findOne({
    $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
    ]
})
if(existing_connection_request){
    throw new Error("Connection request already exists")
}

const data = await connectionRequests.save()
res.json({
    message:"connection request",
    data:data
})

} catch (error) {
    res.status(400).send(error.message)
}
})





module.exports=connectionRouter;
