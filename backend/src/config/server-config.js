require('dotenv').config();
module.exports = {
    BACKEND_PORT: process.env.BACKEND_PORT ,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ,
    JWT_EXPIRE: process.env.JWT_EXPIRE ,
    EXPIRES_IN: process.env.EXPIRES_IN,
    ADMIN_EMAIL:process.env.ADMIN_EMAIL,
    ADMIN_EMAIL_PASSWORD:process.env.ADMIN_EMAIL_PASSWORD,
    ADMIN_EMAIL2:process.env.ADMIN_EMAIL2,
    ADMIN_EMAIL_PASSWORD2:process.env.ADMIN_EMAIL_PASSWORD2,
    ADMIN_CREATE_FLAG:0
};