const { AuthRepository } = require('../repositories');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { serverConfig } = require('../config');
const bcrypt = require('bcryptjs');
const { mailSender } = require("../config/mail-config");
const { find } = require('../models/user-model');


const authRepo = new AuthRepository();
async function createUser(data) {
    try {
        email = data.email;
        const existingUser = await authRepo.findUserByEmail(email);
        if (existingUser) {
            throw new AppError("User already exists", StatusCodes.BAD_REQUEST);
        }
        const regex = /^[0-9]{2}[a-z]{3}[0-9]{3}@nith\.ac\.in$/;
        const checkMailFormat = regex.test(email);
        // console.log(!checkMailFormat);
        if (checkMailFormat) {
            throw new AppError("Invalid email format", StatusCodes.BAD_REQUEST);

        }
        const user = await authRepo.create(data);
        return user;
    } catch (err) {
        throw err;
    }
}
async function signIn(data) {
    try {
        email = data.email;
        // console.log(email);
        const user = await authRepo.findUserByEmail(email);
        if (!user) {
            throw new AppError("Invalid email", StatusCodes.BAD_REQUEST);
        }
        if (!user.verified) {

            throw new AppError("User not verified", StatusCodes.BAD_REQUEST);
        }
        const isMatch = await comparePassword(data.password, user.password);
        // console.log("hgfh",data.password);
        // console.log("hgfh",isMatch);
        if (!isMatch) {
            throw new AppError("Invalid password", StatusCodes.BAD_REQUEST);
        }

        return user;
    } catch (error) {

        throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
}

async function resetPassword(data) {
    try {
        email = data.email
        const user = await authRepo.findUserByEmail(email);
        if (!user) {
            throw new AppError('Invaild Email', StatusCodes.BAD_REQUEST);
        }
        const isMatch = await comparePassword(data.password, user.password);
        if (!isMatch) {
            throw new AppError('Invaild Password', StatusCodes.BAD_REQUEST);
        }
        user.password = data.newpassword;

        await user.save();
        return user;

    } catch (error) {
        throw new AppError('Invaild Credentails', StatusCodes.BAD_REQUEST);
    }
}

async function updatePassword(email) {
    try {
        const user = await authRepo.findUserByEmail(email);
        if (!user) {
            ErrorResponse.message = 'User not found';
            throw new AppError('User not found', StatusCodes.BAD_REQUEST);
        }
        const token= await generateToken(user);
        const resetLink = `${process.env.FRONT_URL}/resetpassword/${token}`;
        const response = await mailSender.sendMail({
            from: "no-reply-EstateOffice@nith.ac.in",
            to: user.email,
            subject: 'Password reset request',
            text: `You requested to reset your password. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request a password reset, please ignore this email.`,
            html: `<p>You requested to reset your password. Click the link below to reset your password:</p>
               <a href="${resetLink}">Reset Password</a>
               <p>If you did not request a password reset, please ignore this email.</p>`
        });
        return token;
    } catch (error) {
        throw new AppError('Invaild Email', StatusCodes.BAD_REQUEST);
    }
}

async function updateTokenPassword(data) {
    try {
        email = data.email;
        const user = await authRepo.findUserByEmail(email);
        if (!user) {
            throw new AppError('Invaild Email', StatusCodes.BAD_REQUEST);
        }
        user.password = data.newpassword;

        await user.save();
        return user;

    } catch (error) {
        
        throw new AppError('Invaild Credentails', StatusCodes.BAD_REQUEST);
    }
}


async function generateToken(params) {
    try {
        // console.log(serverConfig.JWT_SECRET_KEY);
        const token = jwt.sign({ id: params._id }, serverConfig.JWT_SECRET_KEY, { expiresIn: serverConfig.JWT_EXPIRE });
        return token;
    } catch (err) {
        throw err;
    }
}

async function comparePassword(plainPassword, hashedPassword) {
    // console.log(plainPassword,hashedPassword);
    return bcrypt.compare(plainPassword, hashedPassword);
}

async function isAuthentication(token) {
    try {
        const decoded = jwt.verify(token, serverConfig.JWT_SECRET_KEY);

        const user = await authRepo.findUserById(decoded.id);
        return user;
    } catch (err) {

        throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);
    }
}

async function verifysend(email) {
    try {
        const user=await authRepo.findUserByEmail(email);
        if (!user) {        
            throw new AppError('Invaild Email', StatusCodes.BAD_REQUEST);
        }
        if (user.verified) {
            throw new AppError('User already verified', StatusCodes.BAD_REQUEST);
        }
        
        const token= await generateToken(user);
        

        const Link=`${process.env.FRONT_URL}/verify-account?account=${token}`;
        

        const response = mailSender.sendMail({
            from: serverConfig.ADMIN_EMAIL,
            to: email,
            subject: "Verify Your Email - Complete Your Account Registration 🚀",
            html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            margin: auto;
        }
        .btn {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 12px 20px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Welcome to Venue Booking System!</h2>
        <p>Thank you for creating an account with us. To complete your registration, please verify your email address by clicking the button below.</p>
        <a href=${Link} class="btn">Verify Your Account</a>
        <p>If you did not create this account, you can safely ignore this email.</p>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Venue Booking System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`




        })
        return response;

    }
    catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Invaild Email', StatusCodes.BAD_REQUEST);
    }
}
async function verifyAccount(email){
    try{
        const user=await authRepo.findUserByEmail(email);
        if (!user) {        
            throw new AppError('Invaild Email', StatusCodes.BAD_REQUEST);
        }
        if (user.verified) {
            throw new AppError('User already verified', StatusCodes.BAD_REQUEST);
        }
        user.verified=true;
        await user.save();
        return user;
    }
    catch(error){
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Invaild Email', StatusCodes.BAD_REQUEST);
    }
}

module.exports = {
    createUser,
    signIn,
    generateToken,
    isAuthentication,
    resetPassword,
    updatePassword,
    updateTokenPassword,
    verifysend,verifyAccount

}
