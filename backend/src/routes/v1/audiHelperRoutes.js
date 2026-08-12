const express=require('express');
const { CheckAdmin } = require('../../middlewares');
const {AudiHelperController}=require('../../controllers')
const router=express.Router();


router.post('/add',CheckAdmin.checkAdmin,AudiHelperController.addHelper);
router.get('/get/:id',CheckAdmin.checkAdmin,AudiHelperController.getHelperById);
router.get('/get',CheckAdmin.checkAdmin,AudiHelperController.getAllHelper);
router.patch('/update/:id',CheckAdmin.checkAdmin,AudiHelperController.updateHelper);
router.delete('/delete/:id',CheckAdmin.checkAdmin,AudiHelperController.deleteHelper);

module.exports=router;