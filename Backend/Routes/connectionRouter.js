
const express=require('express')
const connectionRouter=express.Router();
const UserAuth=require('../Authentication/userAuth')
const connectionRequest=require('../models/connectionRequest')
const User = require('../models/UserSchema');
const { createHashRouter } = require('react-router');

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

connectionRouter.post("/request/review/:status/:requestId",UserAuth,async(req,res)=>{
try{
 
    const LoggedInUser=req.user
    const status=req.params?.status
    const requestId=req.params?.requestId


    const ALLOWED_STATUS=["accepted","rejected"];
    if(!ALLOWED_STATUS.includes(status)){
        throw new Error('Invalid Entry')
    }


    const check_connectionRequests = await connectionRequest.findOne({
        _id:requestId,
        status:"interested",
        toUserId:LoggedInUser._id
        
    })
     if(!check_connectionRequests){
        throw new Error("user is not present")
    }
    check_connectionRequests.status=status;
    const data  = await check_connectionRequests.save();
    res.json({
        message:"your connection request list",
        data:data
    })


}
catch(err){
   res.status(400).send(err.message)
}




})



module.exports=connectionRouter;
