const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String,
    },
    address:{
        type:String,
    },
    department:{
        type:String,
        default:"Computer Science"
    },
    division:{
        type:String,
        default:"-"
    }
    
})

module.exports=mongoose.model('User', userSchema)