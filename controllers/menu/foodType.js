require('dotenv').config();
// controllers/userType.js
const Food = require('../../models/menu/foodItem.js');
// Controller to add a new food type
add = async (req, res) => {

    const getNextSequenceValue = async () => {
        const total = await Food.countDocuments();
        return total;
    }

    try {
        const id = await getNextSequenceValue(Food);
        const resp = req.body
        const food = await Food.findOne({ name: req.body.name });

        if (!food) {
            const newFood = new Food({
                id: id + 1,
                name: req.body.name,
                description: req.body.description
            });
            await newFood.save();
            res.status(201).json(newFood);
        } else {
            res.status(400).json({ message: "Food Type already exists" })
        }

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller to get all food types
get = async (req, res) => {
    try {
        const foodTypes = await Food.find();
        res.json(foodTypes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to get one Food type by ID
getOne = async (req, res) => {
    try {
        const foodType = await Food.findById(req.params.id);
        if (!foodType) {
            return res.status(404).json({ message: 'Food type not found' });
        }
        res.json(foodType);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to delete a Food type by ID
deleteOne = async (req, res) => {
    try {
        const foodType = await Food.findByIdAndRemove(req.params.id);
        if (!foodType) {
            return res.status(404).json({ message: 'Food type not found' });
        }
        res.json({ message: 'Food type deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to update a food type by ID
update = async (req, res) => {
    try {
        const foodType = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!foodType) {
            return res.status(404).json({ message: 'Food type not found' });
        }
        res.json(foodType);
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