const {StatusCodes}=require('http-status-codes');
const {BookingService}=require('../services');
const {SuccessResponse,ErrorResponse}=require('../utils/common');


async function addBooking(req,res) {
    const data={
        user:req.user._id,
        hall:req.body.hall,
        title:req.body.title,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        startTime:req.body.startTime,
        endTime:req.body.endTime,
        resonForBooking:req.body.resonForBooking,
        document:req.body.document,
        Organization:req.body.Organization,
        status:"pending"
    }
    try {
        const booking = await BookingService.createBooking(data);
        if(!booking) {
            ErrorResponse.message = "Booking not created";
            res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }
        SuccessResponse.data = booking;
        SuccessResponse.message = "Booking added successfully";
        res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while adding booking";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


async function getBooking(req,res) {
    try {
       
        const { status } = req.query; 
        
        const filter = {};

        if (status) {
            filter.status = status;
        }
        const booking = await BookingService.getBooking(filter);
        SuccessResponse.data = booking;
        SuccessResponse.message = "Booking fetched successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        
        
        ErrorResponse.message = "Error while fetching booking";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


async function getBookingById(req,res) {
    const id = req.params.id;
    try {
        const booking = await BookingService.getBookingById(id);
        SuccessResponse.data = booking;
        SuccessResponse.message = "Booking fetched successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while fetching booking";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getBookingByUser(req,res) {
    const id = req.user._id;
    try {
        const booking = await BookingService.getBookingByUser(id);
        SuccessResponse.data = booking;
        SuccessResponse.message = "Booking fetched successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while fetching booking";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


async function updateBooking(req,res) {
    const id = req.params.id;
    const data={
        user:req.user._id,
        hall:req.body.hall,
        title:req.body.title,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        startTime:req.body.startTime,
        endTime:req.body.endTime,
        resonForBooking:req.body.resonForBooking,
        document:req.body.document,
        Organization:req.body.Organization,

    }
    try {
        const booking = await BookingService.updateBooking(id,data);
        SuccessResponse.data = booking;
        SuccessResponse.message = "Booking updated successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while updating booking";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


async function deleteBooking(req,res) {
    const id = req.params.id;
    try {
        const booking = await BookingService.deleteBooking(id);
        SuccessResponse.data = booking;
        SuccessResponse.message = "Booking deleted successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while deleting booking";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function updateBookingStatus(req,res) {
    const id = req.params.id;
    const data={
        status:req.body.status,
        Iscustom:req.body.Iscustom||false,
        messFromAdmin:req.body.messFromAdmin,
        conflicts:req.body.conflicts||[]
    }
    
    try {
        const booking = await BookingService.updateBookingStatus(id,data);
        SuccessResponse.data = booking;
        SuccessResponse.message = "Booking status updated successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while updating booking status";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}
async function CancelBooking(req,res) {
    const id = req.params.id;
    if(!id) {
        ErrorResponse.message = "Booking id is required";
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    const booking = await BookingService.getBookingById(id);
    if(!booking) {
        ErrorResponse.message = "Booking not found";
        return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
    }
    if(booking.status==="cancelled") {
        ErrorResponse.message = "Booking already cancelled";
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(booking.user._id.toString()!==req.user._id.toString()) {
        ErrorResponse.message = "You are not authorized to cancel this booking";
        return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }
    const data={
        status:"cancelled"
    }
    try {
        const booking = await BookingService.updateBooking(id,data);
        SuccessResponse.data = booking;
        SuccessResponse.message = "Booking cancelled successfully";
        res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error while cancelling booking";
        ErrorResponse.error = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}




module.exports={
    addBooking,
    getBooking,
    getBookingById,
    getBookingByUser,
    updateBooking,
    deleteBooking,
    updateBookingStatus,
    CancelBooking
}