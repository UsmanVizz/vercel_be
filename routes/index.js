const express = require('express');
const router = express.Router();

const loginAuth = require('./Users/userAuthRoute.js');
const building = require('./Branch/branchRoute.js');


router.use('/auth', loginAuth);
router.use('/building', building);


router.get("/", async (req, res) => {
    res.status(500).send('Node Working')
})



module.exports = router;