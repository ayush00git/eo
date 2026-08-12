const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const { AuthService } = require("../services");

async function signUp(req,res) {
    try {
        const data={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        }
        const user=await AuthService.createUser(data);
        SuccessResponse.data=user;
        SuccessResponse.message="User Registered successfully";
        return res.status(StatusCodes.OK).json(SuccessResponse);
        
    } catch (err) {
        console.log(err);
        ErrorResponse.error = err;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}


async function signIn(req,res) {
    try {
        const data={
            email:req.body.email,
            password:req.body.password
        }
        const user=await AuthService.signIn(data);
        if(user){
            const token=await AuthService.generateToken(user);
            SuccessResponse.data={user,token};
            SuccessResponse.message="User logged in successfully";
            // SuccessResponse.data.token=token;
            return res.status(StatusCodes.OK).json(SuccessResponse);
        }
        ErrorResponse.message="Invalid credentials";
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        
    } catch (err) {
        console.log(err);
        ErrorResponse.error=err;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}
async function check(req,res) {
    try {
        const user=req.user;
        if(user){
            SuccessResponse.data=user;
            SuccessResponse.message="User found";
            return res.status(StatusCodes.OK).json(SuccessResponse);
        }
        ErrorResponse.message="User not found";
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        
    } catch (err) {
        console.log(err);
        ErrorResponse.error=err;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}


async function resetPassword(req,res) {
    try {
        const data={
            email:req.user.email,
            password:req.body.password,
            newpassword:req.body.newpassword
        }
        // if(data.password===data.newpassword){
        //     ErrorResponse.message='New password is same as old password.'
        //     return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        // }
        const response= await AuthService.resetPassword(data);
        if(response){
            SuccessResponse.message="Password Changed Successfully"
            return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
        }
        ErrorResponse.message='Failed to change password';
        return res.status(StatusCodes.EXPECTATION_FAILED).json(ErrorResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error=error
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}

async function updatePassword(req,res) {
    const email=req.body.email;
    try {
        if(!email){
            ErrorResponse.message='Please Enter Email';
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }
        const response=await AuthService.updatePassword(email);
        if(response){
            SuccessResponse.message='Email Sended. PLease check your inbox';
            return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
        }
        ErrorResponse.message='Failed to send link';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.message='Invalid Email Address';
        ErrorResponse.error=error;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}

async function updateTokenPassword(req,res) {
    try {
        const data={
            newpassword:req.body.newpassword,
            email:req.user.email
        }
        if(!req.user){
            ErrorResponse.message='Something went wrong while reseting password with link';
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
        }
        const response= await AuthService.updateTokenPassword(data);
        if(response){
            SuccessResponse.message="Password Changed Successfully"
            return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
        }
    } catch (error) {
        console.log(error);
        ErrorResponse.error=error
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}
async function verifysend(req,res) {
    try {
        const email=req.body.email;
        const response=await AuthService.verifysend(email);
        console.log(response);
        
        if(response){
            SuccessResponse.message='Verification mail sent';
            return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
        }
        ErrorResponse.message='Failed to send verification mail';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error=error;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}
async function verifyAccount(req,res) {
    try {
        const email=req.user.email;
        const response=await AuthService.verifyAccount(email);
        if(response){
            SuccessResponse.message='Account Verified';
            return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
        }
        ErrorResponse.message='Failed to verify account';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error=error;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}



module.exports={
    signIn,
    signUp,
    check,
    resetPassword,
    updatePassword,
    updateTokenPassword,
    verifysend,
    verifyAccount
}

