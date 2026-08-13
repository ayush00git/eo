require('dotenv').config();
module.exports = {
    BACKEND_PORT: process.env.BACKEND_PORT ,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ,
    JWT_EXPIRE: process.env.JWT_EXPIRE ,
    ADMIN_EMAIL:process.env.ADMIN_EMAIL,
    ADMIN_EMAIL_PASSWORD:process.env.ADMIN_EMAIL_PASSWORD,
    ADMIN_CREATE_FLAG:0
};