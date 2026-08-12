const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
// const { success } = require("../utils/common/success-response");
const { AdminAuthService } = require("../services");
const {serverConfig} = require('../config');

async function signup(req, res) {
    try {
        // if (serverConfig.ADMIN_CREATE_FLAG === 0) {
            const { email, password } = req.body;
            const admin = await AdminAuthService.createAdmin({ email, password });
            SuccessResponse.data = admin;
            SuccessResponse.message = "Admin Registered successfully";
            serverConfig.ADMIN_CREATE_FLAG = 1;
            return res.status(StatusCodes.OK).json(SuccessResponse);
        // }
        // else {
        //     ErrorResponse.message = "Cant add more admins";
        //     ErrorResponse.error = error;
        //     return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        // }
    } catch (error) {
        ErrorResponse.message = "Admin already exists";
        ErrorResponse.error = error;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}

async function checklogin(req, res) {
    try {
        const { email, password } = req.body;
        const admin = await AdminAuthService.login({email, password});
        if (admin) {
            const token = await AdminAuthService.generateToken(admin);
            SuccessResponse.data = { admin, token };
            SuccessResponse.message = "Admin logged in successfully";
            return res.status(StatusCodes.OK).json(SuccessResponse);
        }
        ErrorResponse.message = "Invalid credentials";
        ErrorResponse.error = error;
        return res.json(ErrorResponse);
    } catch (error) {
        ErrorResponse.error = error;
        ErrorResponse.message = error.message;
        return res.json(ErrorResponse);
    }
}

async function check(req, res) {
    try {
        const token=req.headers.authorization.split(" ")[1];
        const admin = await AdminAuthService.isAuthentication(token);
        if (admin) {
            SuccessResponse.data = admin;
            SuccessResponse.message = "Admin logged in successfully";
            return res.status(StatusCodes.OK).json(SuccessResponse);
        }
        ErrorResponse.message = "Invalid credentials";
        ErrorResponse.error = error;
        return res.json( ErrorResponse);
    } catch (error) {
        ErrorResponse.error = error;
        ErrorResponse.message = error.message;
        return res.json(ErrorResponse );
    }
}


module.exports = {
    signup,
    checklogin,
    check}