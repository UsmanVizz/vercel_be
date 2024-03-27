const express = require('express');
const router = express.Router();
const branch = require('../../controllers/Branch/branchController.js');
const branchType = require('../../controllers/Branch/branchType.js');
const hall = require('../../controllers/Branch/hallController.js');



router.post('/branch', branch.newBranch);
router.get('/branch', branch.allBranch);
router.get('/branch/:id', branch.oneBranch);
router.delete('/branch/:id', branch.delBranch);
router.patch('/branch/:id', branch.updateBranch);


router.post('/branchType', branchType.add);
router.get('/branchType', branchType.get);
router.get('/branchType/:id', branchType.getOne);
router.delete('/branchType/:id', branchType.deleteOne);
router.patch('/branchType/:id', branchType.update);



router.post('/hall', hall.newHall);
router.get('/hall', hall.allHall);
router.get('/hall/:id', hall.oneHall);
router.delete('/hall/:id', hall.delHall);
router.patch('/hall/:id', hall.updateHall);



router.get("/", async (req, res) => {
    res.status(500).send('Node Branch Working')
})

module.exports = router;
