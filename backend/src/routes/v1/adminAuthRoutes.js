const express = require('express');
const { AuthRequestMiddleware } = require('../../middlewares');
const { adminAuthController } = require('../../controllers');

// const {CheckAdmin} = require('../../middlewares');
// const {HallController} = require('../../controllers');
const router = express.Router();


// router.post('/signup', AuthRequestMiddleware.validateAuthRequest, adminAuthController.signup);
router.post('/login', AuthRequestMiddleware.validateAuthRequest, adminAuthController.checklogin);
router.post('/check', adminAuthController.check);



// router.post('/addHall',CheckAdmin.checkAdmin,HallController.addHall);



module.exports = router;
