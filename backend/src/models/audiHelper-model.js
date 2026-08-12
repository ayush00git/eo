const mongoose=require('mongoose');

const audiHelperSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phoneNumber:{
        type:Number,
        require:true
    },
    designation:{
        type:String,
        require:true
    },
    venue:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hall',
        required:true
    }
},{
    timestamps:true
});

const AudiHelper= mongoose.model('AudiHelper',audiHelperSchema);
module.exports=AudiHelper;