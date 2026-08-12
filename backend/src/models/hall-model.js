const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hallSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    capacity:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    description:{
        type:String
    }
},{timestamps: true});

const Hall=mongoose.model('Hall',hallSchema);

module.exports=Hall;