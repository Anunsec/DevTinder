const express = require('express')
const connectDB = require('../database/database')
const app = express()







connectDB().then(()=>{
    try{
     console.log("DB connected succesfully")
     app.listen(3000,()=>{
     console.log("server is running on port number 3000")
})
    }
    catch(err){
        console.log(err.message);
    }
})
