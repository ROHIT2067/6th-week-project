const mongoose=require('mongoose')


const loginSchema=new mongoose.Schema({
  username:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true,
  },
  isAdmin:{
    type:Boolean,
    default:false,
  }
  
})

const collection=new mongoose.model('userData',loginSchema)

module.exports=collection