
const mongoose = require('mongoose')
const url = ""

const connectDB = async () => {
await mongoose.connect(url)
}

module.exports=connectDB;
