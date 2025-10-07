const express = require('express')
const connectDB = require('../database/database')
const app = express()
const AuthRouter= require('../Routes/AuthRouter')
const cookieparser=require('cookie-parser')

app.use(express.json())
app.use(cookieparser())

app.use("/user",AuthRouter)




connectDB()
    .then(() => {
        console.log("DB connected successfully");
        app.listen(3000, () => console.log("Server running on port 3000"));
    })
    .catch(err => console.log("DB connection failed:", err.message));
