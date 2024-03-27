const express = require('express');
const router = express.Router();
const food_type = require('../../controllers/menu/foodType.js');
const { authenticateToken } = require('../../middleware/jwtValidator.js');



// Define routes with different paths or HTTP methods
router.post('/foodType', food_type.add);
// router.post('/foodType1', authenticateToken, food_type.add);
router.get('/foodType', food_type.get);
router.get('/foodType/:id', food_type.getOne); // Use a dynamic parameter for ID
router.delete('/foodType/:id', authenticateToken, food_type.deleteOne); // Use a dynamic parameter for ID
router.patch('/foodType/:id', authenticateToken, food_type.update); // Use a dynamic parameter for ID

module.exports = router;