const express=require('express');
const {CheckAdmin}=require('../../middlewares');
const {AuthRequestMiddleware}=require('../../middlewares');
const {BookingController}=require('../../controllers');

const router=express.Router();



router.post('/addBooking',AuthRequestMiddleware.checkAuth,BookingController.addBooking);
router.get('/getBooking',BookingController.getBooking);
router.get('/getBooking/:id',BookingController.getBookingById);
router.get('/getBookingByUser',AuthRequestMiddleware.checkAuth,BookingController.getBookingByUser);
router.patch('/updateBooking/:id',AuthRequestMiddleware.checkAuth,BookingController.updateBooking);
router.delete('/deleteBooking/:id',AuthRequestMiddleware.checkAuth,BookingController.deleteBooking);
router.patch('/updateBookingStatus/:id',CheckAdmin.checkAdmin,BookingController.updateBookingStatus);
router.patch('/cancelBooking/:id',AuthRequestMiddleware.checkAuth,BookingController.CancelBooking);

module.exports=router;



