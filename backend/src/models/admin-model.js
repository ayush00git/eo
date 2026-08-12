const mongoose=require('mongoose');
const bcypt=require('bcryptjs');
const Schema=mongoose.Schema;

const adminSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});


adminSchema.pre('save',async function(next){
    const user=this;
    if(user.isModified('password')){
        user.password=await bcypt.hash(user.password,10);
    }
    next();
})


const Admin=mongoose.model('Admin',adminSchema);

module.exports=Admin;