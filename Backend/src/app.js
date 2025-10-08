const express = require('express')
const connectDB = require('../database/database')
const app = express()
const cookieparser=require('cookie-parser')

const AuthRouter= require('../Routes/AuthRouter')
const profileRouter = require('../Routes/profileRouter')
const connectionRouter = require('../Routes/connectionRouter')

app.use(express.json())
app.use(cookieparser())

app.use("/user",AuthRouter)
app.use("/profile",profileRouter)
app.use("/connection",connectionRouter)


connectDB()
    .then(() => {
        console.log("DB connected successfully");
        app.listen(3000, () => console.log("Server running on port 3000"));
    })
    .catch(err => console.log("DB connection failed:", err.message));
