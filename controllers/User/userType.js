
require('dotenv').config();
// controllers/userType.js
const User = require('../../models/Users/usertype.js');
// Controller to add a new user type
add = async (req, res) => {

    const getNextSequenceValue = async () => {
        const total = await User.countDocuments();
        return total;
    }

    try {
        const id = await getNextSequenceValue(User);
        const resp = req.body
        const user = await User.findOne({ name: req.body.name });

        if (!user) {
            const newUser = new User({
                id: id + 1,
                name: req.body.name,
                description: req.body.description
            });
            await newUser.save();
            res.status(201).json(newUser);
        } else {
            res.status(400).json({ message: "User Type already exists" })
        }

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller to get all user types
get = async (req, res) => {
    try {
        const userTypes = await User.find();
        res.json(userTypes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to get one user type by ID
getOne = async (req, res) => {
    try {
        const userType = await User.findById(req.params.id);
        if (!userType) {
            return res.status(404).json({ message: 'User type not found' });
        }
        res.json(userType);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to delete a user type by ID
deleteOne = async (req, res) => {
    try {
        const userType = await User.findByIdAndRemove(req.params.id);
        if (!userType) {
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
        const userType = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!userType) {
            return res.status(404).json({ message: 'User type not found' });
        }
        res.json(userType);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    add,
    get,
    getOne,
    update,
    deleteOne

}