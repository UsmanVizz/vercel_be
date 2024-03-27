
require('dotenv').config();
// controllers/userType.js
const BranchType = require('../../models/Branch/branchType.js');

// Controller to add a new user type
add = async (req, res) => {
    const getNextSequenceValue = async () => {
        const total = await BranchType.countDocuments();
        return total;
    }

    try {
        const id = await getNextSequenceValue(BranchType);
        const resp = req.body

        branch = await BranchType.findOne({ name: req.body.name });

        if (!branch) {
            const newBranchType = new BranchType({
                id: id + 1,
                name: req.body.name,
                description: req.body.description
            });
            await newBranchType.save();
            res.status(201).json(newBranchType);
        } else {
            res.status(400).json({ status: "400", error: 'Branch type already exists' });
        }


    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller to get all user types
get = async (req, res) => {
    try {
        const branchType = await BranchType.find();
        res.json(branchType);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to get one user type by ID
getOne = async (req, res) => {
    try {
        const branchType = await BranchType.findById(req.params.id);
        if (!branchType) {
            return res.status(404).json({ message: 'User type not found' });
        }
        res.json(branchType);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to delete a user type by ID
deleteOne = async (req, res) => {
    try {
        const branchType = await BranchType.findByIdAndRemove(req.params.id);
        if (!branchType) {
            return res.status(404).json({ message: 'User type not found' });
        }
        res.json({ message: 'User type deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to update a user type by ID
update = async (req, res) => {
    try {
        const branchType = await BranchType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!branchType) {
            return res.status(404).json({ message: 'User type not found' });
        }
        res.json(branchType);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    add,
    get,
    getOne,
    deleteOne,
    update
}