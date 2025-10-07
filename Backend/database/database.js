
const mongoose = require('mongoose')
const url = "mongodb+srv://Anurag:XqRCNSN4ziRMnNgL@backendproject.dyzp9pd.mongodb.net/?retryWrites=true&w=majority&appName=Backendproject"

const connectDB = async () => {
await mongoose.connect(url)
}

module.exports=connectDB;