require('dotenv').config();
const Amenities = require('../../models/Amanities/amanities.js');

// Controller to add a new user type
add = async (req, res) => {

    const getNextSequenceValue = async () => {
        const total = await Amenities.countDocuments();
        return total;
    }
    try {
        const id = await getNextSequenceValue(Amenities);
        const resp = req.body
        const checkAmenities = await Amenities.findOne({ name: resp.body.name });

        if (!checkAmenities) {
            const newAmenities = new Amenities({
                id: id + 1,
                name: req.body.name
            });
            await newAmenities.save();
            res.status(201).json({ newAmenities, message: "Amenities Created " });

        } else {
            res.status(400).json({ message: "Amenities Already Exist " });
        }

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller to get all user types
get = async (req, res) => {
    try {
        const AmenitiesTypes = await Amenities.find();
        res.json(AmenitiesTypes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to get one user type by ID
getOne = async (req, res) => {
    try {
        const AmenitiesType = await Amenities.findById(req.params.id);
        if (!AmenitiesType) {
            return res.status(404).json({ message: 'User type not found' });
        }
        res.json(AmenitiesType);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to delete a user type by ID
deleteOne = async (req, res) => {
    try {
        const AmenitiesType = await Amenities.findByIdAndRemove(req.params.id);
        if (!AmenitiesType) {
            return res.status(404).json({ message: 'Amenities type not found' });
        }
        res.json({ message: 'Amenities type deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to update a user type by ID
update = async (req, res) => {
    try {
        const AmenitiesType = await Amenities.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!AmenitiesType) {
            return res.status(404).json({ message: 'Amenities type not found' });
        }
        res.json(AmenitiesType);
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


