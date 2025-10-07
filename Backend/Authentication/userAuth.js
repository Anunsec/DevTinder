const jwt = require("jsonwebtoken")
const User = require('../models/UserSchema')

//steps
//1.cookie fetch kro body se  
//2.token hai mi nhi check karo
//2. token verify karo 
//3.id fetch karo
//4.db me dhundo user hai ki nhi
//5.req.user=user

const UserAuth=async(req,res,next)=>{
    try{

const cookies = req.cookies
const{Token}=cookies
if(!Token){
    return res.status(500).send("Token is not Present!!")
}
const decoded_message=jwt.verify(Token,"Anu@123")
const {_id} = decoded_message

const user = await User.findById(_id)
if(!user){
   return  res.status(401).send("Token is not Present!!")
}
req.user=user
next()
    }
    catch(err){
        res.status(400).send(err.message)
    }



}
module.exports=UserAuth;
