const mongoose=require('mongoose')

const roomSchema=new mongoose.Schema({
    topic   :{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    hostId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true    
    },
    limit:{
        type:Number||String,
        required:true,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    invitedStudents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]

})

module.exports=mongoose.model('Room',roomSchema)