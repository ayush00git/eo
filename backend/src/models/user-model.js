const mongoose = require('mongoose');
const bcypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});



userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcypt.hash(user.password, 10);
    }
    next();
});



const User = mongoose.model('User', userSchema);

module.exports = User;