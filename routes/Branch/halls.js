const express = require('express');
const router = express.Router();
const hall = require('../../controllers/Branch/hallController.js');


router.post('/hall', hall.newHall);
router.get('/hall', hall.allHall);
router.get('/hall/:id', hall.oneHall);
router.delete('/hall/:id', hall.delHall);
router.patch('/hall/:id', hall.updateHall);


module.exports = router;