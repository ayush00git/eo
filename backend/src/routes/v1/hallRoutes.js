const express = require('express');
const {CheckAdmin} = require('../../middlewares');
const {HallController} = require('../../controllers');
const router = express.Router();

router.post('/addHall',CheckAdmin.checkAdmin,HallController.addHall);
router.get('/getHall',HallController.getHall);
router.get('/getHall/:id',HallController.getHallById);
router.patch('/updateHall/:id',HallController.updateHall);
router.delete('/deleteHall/:id',CheckAdmin.checkAdmin,HallController.deleteHall);

module.exports = router;