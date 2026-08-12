const express=require('express');
const {AuthRequestMiddleware}=require('../../middlewares');
const {AuthConroller}=require('../../controllers');
const router=express.Router();

router.post('/signup',AuthRequestMiddleware.validateAuthRequest,AuthConroller.signUp);
router.post('/signin',AuthRequestMiddleware.validateAuthRequest,AuthConroller.signIn);
router.post('/check',AuthRequestMiddleware.checkAuth,AuthConroller.check);
router.post('/send-verification',AuthConroller.verifysend);
router.post('/verify-account',AuthRequestMiddleware.checkAuth,AuthConroller.verifyAccount);
router.patch('/reset-password', AuthConroller.updatePassword);
router.post('/update-password',AuthConroller.resetPassword);
router.post('/update',AuthRequestMiddleware.checkAuth,AuthConroller.updateTokenPassword);



module.exports=router;