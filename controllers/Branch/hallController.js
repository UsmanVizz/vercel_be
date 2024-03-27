const multer = require('multer');
const { upload } = require("../../middleware/multer.js")
const Hall = require("../../models/Branch/hall.js");
// const { authenticateToken } = require("../../middleware/authenticateToken.js");
require('dotenv').config();
const { saveHall } = require("../../services/saveBranch.js")
const { upDateBranch } = require("../../services/saveBranch.js")


newHall = async (req, res) => {

    try {
        // Use upload.single("image") middleware to handle image upload
        // upload.multi("image")(req, res, async function (err) {
        upload.single("image")(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                return res.status(400).json({ status: 400, error: 'Image upload failed' });
            } else if (err) {
                // An unknown error occurred
                return res.status(500).json({ status: 500, error: 'Internal server error' });
            }

            const response = req.body;
            response.image = req.file.path;
            // Check if the email is already in use
            const existingHall = await Hall.findOne({ _id: response._id });
            if (existingHall) {
                return res.status(400).json({ status: 400, error: 'Hall is already in Created' });
            }
            // Continue with saving the user
            const hallData = await saveHall(Hall, response, res, req.file ? req.file.path : null);

            res.status(200).json({
                status: 200,
                data: hallData,
                message: 'Hall has been created',
            });
        });
    } catch (error) {
        console.error('Validation or Signup Error:', error);
        res.status(400).json({ status: 400, error: 'Validation failed or internal error' });
    }
};

allHall = async (req, res) => {

    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const order = req.query.orderby || "asc";
        const sort = req.query.sortby || "branch_name";

        let orderby = {};
        if (order.toLowerCase() === "asc") {
            orderby[sort] = 1; // 1 for ascending order, -1 for descending order
        } else {
            orderby[sort] = -1; // Assuming ascending order by default, modify as needed
        }

        const total = await Hall.countDocuments(); // Count all users
        const users = await Hall.find({
            $or: [
                { branch_name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                // Add more fields as needed
            ]
        }).skip(skip).limit(limit).sort(orderby);

        // if (users.length > 0) {
        res.status(200).json({
            status: "Success",
            data: { users },
            message: "All Halls fetched successfully",
            currentPage: page,
            totalDetailData: users.length,
            totalData: total,
            nextPage: total > skip + limit,
            prevPage: page !== 1,
        });
        // } else {
        //     res.status(404).json({ status: 404, error: "Internal Server Error" });
        // }
    } catch (error) {
        console.error("Error Fetching All Hall Data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

};


oneHall = async (req, res) => {

    try {
        const userId = req.params.userId;

        const hall_data = await Hall.findOne({ _id: userId });

        res.status(200).json({
            status: 200,
            data: hall_data,
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

delHall = async (req, res) => {
    try {
        const userId = req.params.userId;
        await Hall.deleteOne({ _id: userId });
        res.status(200).json({ message: 'Hall deleted successfully' });
    } catch (error) {
        console.error('Error deleting Hall:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

updateHall = async (req, res) => {
    try {
        // Use upload.single("image") middleware to handle image upload
        upload.single("image")(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                return res.status(400).json({ status: 400, error: 'Image upload failed' });
            } else if (err) {
                // An unknown error occurred
                return res.status(500).json({ status: 500, error: 'Internal server error' });
            }

            const response = req.body;
            const hallData = await upDateHall(Hall, response, req.file ? req.file.path : null);

            res.status(200).json({
                status: 200,
                data: hallData,
                message: 'Hall has been created',
            });
        });
    } catch (error) {
        console.error('Validation or Signup Error:', error);
        res.status(400).json({ status: 400, error: 'Validation failed or internal error' });
    }

};

module.exports = {
    newHall,
    allHall,
    oneHall,
    delHall,
    updateHall
}
