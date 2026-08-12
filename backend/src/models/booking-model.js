const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    hall:{
        type:Schema.Types.ObjectId,
        ref:'Hall',
        required:true
    },
    title:{
        type: String,
        required: true
    },
    Organization:{
        type: String,
        required: true

    },
    startDate:{
        type: String,
        required: true
    },
    endDate:{
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    resonForBooking: {
        type: String,
    },
    document: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    messFromAdmin:{
        type: String,
    },
},{timestamps: true});


const Booking =mongoose.model('Booking ',bookingSchema);
module.exports=Booking;