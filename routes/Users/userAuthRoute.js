const express = require('express');
const router = express.Router();
const userAuth = require('../../controllers/User/userAuthController.js');
const user_type = require('../../controllers/User/userType.js');
const { authenticateToken } = require('../../middleware/jwtValidator.js');

router.post('/login', userAuth.login);
router.post('/signup', userAuth.signup);
router.post('/forgot-password', userAuth.forgotPassword);
router.post('/verifyOtp', userAuth.resetPassword);
router.patch('/change-password', userAuth.changePassword);
router.get('/get-users', userAuth.get_users);
router.get('/get-users/:id', userAuth.getOne_users);
router.delete('/get-users/:id', authenticateToken, userAuth.deleteOne);
router.patch('/get-users/:id', authenticateToken, userAuth.update);


// Define routes with different paths or HTTP methods
router.post('/userType', user_type.add);
// router.post('/userType1', authenticateToken, user_type.add);
router.get('/userType', user_type.get);
// router.get('/userType/:id', user_type.getOne); 
router.get('/userType/:id', authenticateToken, user_type.getOne);
router.delete('/userType/:id', authenticateToken, user_type.deleteOne);
router.patch('/userType/:id', authenticateToken, user_type.update);


router.get("/", async (req, res) => {
    res.status(500).send('Node User Working')
})

module.exports = router;
