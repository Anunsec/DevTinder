const mongoose = require('mongoose')
const validator = require('validator')


const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
     lastName:{
        type:String,
        required:true,
        trim:true
    },
    age:{
       type:Number,
       required:true,
    },
    gender:{
        type:String,
     enum:{
         values:["male","female","others"],
         message:`{VALUE} is incorrect status type`
        } 
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        index:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password:{
     type:String,
     required:true,
      validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong Password")
            }
        }
    },
    skills:{
     type:[String],
    },
    photo:{
        type:String,
    
      validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Url")
            }
        }
    },
    aboutme:{
        type:String,
        default:"This is default about me"
    }
},{timestamps:true})

module.exports=mongoose.model("User",UserSchema)