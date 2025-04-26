const mongoose = require('mongoose');

const connectDb= async ()=>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to Database ${conn.connection.host}`)
    } catch (error) {
        console.log('Error in db connection, ', error.message)
        process.exit(1)
    }
}

module.exports=connectDb