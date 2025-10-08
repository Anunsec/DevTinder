const mongoose = require('mongoose')


const connectionRequestSchema = new mongoose.Schema({


     fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
     },
     toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
     },
     status:{
        type:String,
        enum:{
            values:["accepted","rejected","ignored","interested"],
            message:`{VALUE} is incorrect status type`
         },
        required:true,
     }

},{timestamps:true})
connectionRequestSchema.index({fromUserid:1,toUserid:1}) //compound indexing

connectionRequestSchema.pre("save",function(next){
//  const connectionRequest=this;
 if(this.fromUserId.equals(this.toUserId)){
    throw new Error("Cannot send connection request to yourself")}
    next();

})









module.exports=mongoose.model("connectionRequest",connectionRequestSchema)