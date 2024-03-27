const { saveBranch } = require("../../services/saveBranch.js");
const multer = require('multer');
const { upload } = require("../../middleware/multer.js")
const Branch = require("../../models/Branch/branch.js");
// const { authenticateToken } = require("../../middleware/authenticateToken.js");
require('dotenv').config();
const { upDateBranch } = require("../../services/saveBranch.js")


newBranch = async (req, res) => {
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
            response.image = req.file.path
            // Check if the email is already in use
            const existingBranch = await Branch.findOne({ branch_email: response.branch_email });
            if (existingBranch) {
                return res.status(400).json({ status: 400, error: 'Branch is already in use' });
            }
            // Continue with saving the user
            const branchData = await saveBranch(Branch, response, res);
            // const branchData = await saveBranch(Branch, response, res, req.file ? req.file.path : null);

            res.status(200).json({
                status: 200,
                data: branchData,
                message: 'Branch has been created',
            });
        });
    } catch (error) {
        console.error('Validation or Signup Error:', error);
        res.status(400).json({ status: 400, error: 'Validation failed or internal error' });
    }
};

allBranch = async (req, res) => {

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

        const total = await Branch.countDocuments(); // Count all users
        const users = await Branch.find({
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
            message: "All Branches fetched successfully",
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
        console.error("Error Fetching All Branches Data:", error);
        res.status(500).json({ error: "Internal Server Error " });
    }

};


oneBranch = async (req, res) => {

    try {
        const userId = req.params.userId;

        const branch_data = await Branch.findOne({ _id: userId });

        res.status(200).json({
            status: 200,
            data: branch_data,
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

delBranch = async (req, res) => {
    try {
        const userId = req.params.userId;

        const findUser = await Branch.findOne({ _id: userId });
        if (findUser) {
            await Branch.deleteOne({ _id: userId });
            res.status(200).json({ message: 'Branch deleted successfully' });
        } else {
            res.status(400).json({ message: 'Branch Not Found' });
        }
    } catch (error) {
        console.error('Error deleting Branch:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

updateBranch = async (req, res) => {
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
            const branchData = await upDateBranch(Branch, response, req.file ? req.file.path : null);

            res.status(200).json({
                status: 200,
                data: branchData,
                message: 'Branch has been created',
            });
        });
    } catch (error) {
        console.error('Validation or Signup Error:', error);
        res.status(400).json({ status: 400, error: 'Validation failed or internal error' });
    }

};

module.exports = {
    newBranch,
    allBranch,
    oneBranch,
    delBranch,
    updateBranch
}
