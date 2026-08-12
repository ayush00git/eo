const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { AdminAuthService } = require('../services');

async function checkAdmin(req, res, next) {
    try {
        const authHeader = req.headers.authorization; // Fetch the Authorization header
        if (!authHeader) {
            throw new AppError('No token provided', StatusCodes.UNAUTHORIZED);
        }

        const token = authHeader.split(' ')[1]; // Extract the token part after 'Bearer'
        if (!token) {
            throw new AppError('No token provided', StatusCodes.UNAUTHORIZED);
        }

        const admin = await AdminAuthService.isAuthentication(token);
        // console.log("Admin from service:", admin._id); // Debugging: Log the admin object

        // Check if admin is null or falsy
        if (!admin._id || admin._id === undefined) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(ErrorResponse('Unauthorized access', 'You are not authorized to access this resource'));
        }
        
        req.admin = admin;
        // console.log("Admin from request:", req.admin);
        next();

    } catch (error) {
        console.error("Error in checkAdmin middleware:", error); // Debugging: Log the error
        ErrorResponse.message = 'Something went wrong while authenticating admin';
        ErrorResponse.error = error; 
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }
}

module.exports = { checkAdmin };