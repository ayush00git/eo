const {AdminAuthRepository} = require('../repositories');
const {ErrorResponse} = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const {serverConfig} = require('../config');
const bcrypt = require('bcryptjs');

const authRepo=new AdminAuthRepository();

async function createAdmin({email,password}){
    try {
        const admin = await authRepo.create({email,password});
        const token=await generateToken(admin);
        if(!token){
            throw new AppError("Token not generated", StatusCodes.INTERNAL_SERVER);
        }
        return {admin,token};
    } catch (err) {
        throw err;
    }
}

async function login({email,password}){
    try {
        const admin = await authRepo.getAdminByEmail(email);
        if(!admin){
            throw new AppError("Invalid credentials",StatusCodes.BAD_REQUEST);
        }
        const isMatch = await bcrypt.compare(password,admin.password);
        if(!isMatch){
            throw new AppError("Invalid credentials",StatusCodes.BAD_REQUEST);
        }
        return admin;
    } catch (error) {
        throw new AppError("Invalid credentials", StatusCodes.BAD_REQUEST);
        
    }
}


async function generateToken(params) {
    try {
        // console.log(serverConfig.JWT_SECRET_KEY);
        const token = jwt.sign({ id: params._id }, serverConfig.JWT_SECRET_KEY, {expiresIn: serverConfig.JWT_EXPIRE});
        return token;
    } catch (err) {
        throw err;
    }
}


async function isAuthentication(token) {
    try {
        const decoded = jwt.verify(token, serverConfig.JWT_SECRET_KEY);
        // console.log(decoded)
        const admin = await authRepo.findUserById(decoded.id);
        // console.log(admin)
        // console.log("admin",admin)
        if(!admin){
            ErrorResponse.message = "Invalid token";
            return new AppError(ErrorResponse, StatusCodes.UNAUTHORIZED);
        }
        return admin;
    } catch (err) {
        throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);
    }
}

module.exports={
    createAdmin,
    login,
    generateToken,
    isAuthentication
}
