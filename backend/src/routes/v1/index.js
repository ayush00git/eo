const express = require('express');
const authRoute = require('./authRoutes');
const  adminAuthRoute = require('./adminAuthRoutes');
const hallRoute = require('./hallRoutes');
const bookingRoute=require('./bookingRoutes');
const AudiHelper=require('../v1/audiHelperRoutes')


const router = express.Router();
router.use('/auth', authRoute);
router.use('/admin',adminAuthRoute);
router.use('/hall',hallRoute);
router.use('/booking',bookingRoute);
router.use('/audiHelper',AudiHelper);

module.exports = router;