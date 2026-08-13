const crudRepositories = require('./crudRepositories');

const {Booking,User} = require('../models');

class BookingRepository extends crudRepositories {
    constructor() {
        super(Booking);
    }
    async getByUser(id) {
        try {
            return await this.model.find({ user: id });
        } catch (err) {
            throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    async getById(id) {
        try {
            const booking= await this.model.findById(id);
            booking.user= await User.findById(booking.user);
            return booking;
        } catch (err) {
            throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllbooking(query = {}) {
        try {
            let response = await this.model.find(query).sort({ createdAt: -1 });
    
            // Fetch user details concurrently and modify response
            response = await Promise.all(
                response.map(async (booking) => {
                    const user = await User.findById(booking.user);
                    return {
                        ...booking.toObject(), // Convert Mongoose document to plain object
                        user: user ? { _id: user._id, name: user.name,email:user.email } : null,
                    };
                })
            );
    
            return response;
        } catch (error) {
            throw new AppError(
                "Something went wrong while getting all resources",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}    


module.exports = BookingRepository;