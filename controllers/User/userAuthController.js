const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/Users/users.js');
require('dotenv').config();
const { saveUser } = require("../../services/userService.js");
const multer = require('multer');

const UserOTPVerification = require("../../models/otpVerification.js");

const { sendEmail } = require("../../services/sendEmail.js");
const { generateOTP } = require("../../middleware/genrateOtp.js");
const { upload } = require("../../middleware/multer.js")
const { validateUserData } = require('../../middleware/signUpValidation.js');


login = async (req, res) => {

    try {
        // const response = req.body;
        const user = await User.findOne({ email: req.body.email });
        if (!req.body.email || !req.body.password) {

            return res.status(401).json({ status: 401, message: 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ status: 401, message: 'Invalid email or password' });
        }
        let payload

        if (user.user_type !== 'customer') {
            payload = {
                userId: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                contact_number: user.contact_number,
                address: user.address,
                password: user.password,
                cnic: user.cnic,
                user_type: user.user_type,
                business_name: user.business_name,
                business_pri_num: user.business_pri_num,
                business_sec_num: user.business_sec_num,
                business_email: user.business_email,
                business_web: user.business_web,
                business_location: user.business_location,
                business_geocode: user.business_geocode,
                image: user.image,
                createdAt: user.createdAt,
            };

        } else {
            payload = {
                userId: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                contact_number: user.contact_number,
                address: user.address,
                password: user.password,
                cnic: user.cnic,
                user_type: user.user_type,
                createdAt: user.createdAt,
            };
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ status: 200, token, userId: user._id, data: payload });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};


signup = async (req, res) => {
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
            const existingUser = await User.findOne({ email: response.email });
            if (existingUser) {
                return res.status(400).json({ status: 400, error: 'Email is already in use' });
            }

            // Continue with saving the user using the saveUser service
            const savedUser = await saveUser(User, response, { sendEmail: true });

            res.status(200).json({
                status: 200,
                data: savedUser,
                message: 'User has been created',
            });
        });
    } catch (error) {
        console.error('Validation or Signup Error:', error);
        res.status(400).json({ status: 400, error: 'Validation failed or internal error' });
    }
};


forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Find the user in the database
        const user = await User.findOne({ email: email });

        if (email === "") {
            res.status(401).json({ status: "401", message: 'Email Should be Entered' });
        } else if (!user) {
            res.status(401).json({ status: "401", error: 'Invalid Email' });
            return;
        }

        let userId = user._id

        const otpKeyData = generateOTP();
        const hashedOTP = await bcrypt.hash(otpKeyData, 8);

        const checkUser = await UserOTPVerification.findOne({ userId: userId })
        if (checkUser) {

            const otpUpdate = {
                // userId: checkUser.userId,
                otp: hashedOTP,
                createdAt: Date.now(),
                expireAt: Date.now() + 300000
                // expireAt: Date.now() + 360000,
            };
            const updateOtp = await UserOTPVerification.findByIdAndUpdate(
                { _id: checkUser._id },
                otpUpdate, { new: true }
            );
            res.status(200).json({ status: "200", message: 'OTP re-sent successfully' });
        }
        else {
            const otpVerification = new UserOTPVerification({
                userId: user._id,
                // email: email,
                otp: hashedOTP,
                createdAt: Date.now(),
                expireAt: Date.now() + 360000, // Fixed duplicate createdAt key
            });
            await otpVerification.save();
            res.status(200).json({ status: "200", message: 'OTP sent successfully' });
        }

        await sentOTPVerificationEmail(user.email, otpKeyData);
        // Respond to the client if needed

    } catch (error) {
    }


    const sentOTPVerificationEmail = async (user, oTp) => {

        await sendEmail(user, 'verifyPassword', { otpKey: oTp });

    };
};

resetPassword = async (req, res) => {
    console.log('reset password', req.body)

    try {
        const { userId, otp, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ _id: userId });

        if (userId === "") {
            res.status(401).json({ status: "401", message: 'User ID Should be Entered' });
        } else if (!user) {
            res.status(401).json({ status: "401", error: 'Invalid User ID' });
            return;
        }

        // Find the user in the database
        const userOTP = await UserOTPVerification.findOne({ userId: userId });
        if (!userOTP) {
            res.status(401).json({ status: "401", error: 'No OTP Available' });
            return;
        } else {
            if (userOTP.expireAt < Date.now()) {
                await UserOTPVerification.deleteMany({ expireAt: { $lt: currentTime } });

                res.status(401).json({ status: "401", error: 'OTP Expired' });
                return;
            }
        }

        const otpMatch = await bcrypt.compare(otp, userOTP.otp);

        if (otpMatch) {
            const hashedPassword = await bcrypt.hash(password, 8);
            const updatedUserData = {
                password: hashedPassword
            }
            const updatedUser = await User.findOneAndUpdate({ _id: userId }, updatedUserData, { new: true });
            await UserOTPVerification.deleteMany({ userId: userId });

            res.status(200).json({ status: "200", message: 'Success' });
        } else {
            res.status(401).json({ status: "401", message: 'Invalid Password' });
        }

    }
    catch (error) {
        res.status(500).json({ status: "500", message: 'Something Went Wrong' });
    }

};

changePassword = async (req, res) => {

    try {
        const { userId, password, changepassword } = req.body;

        // Find the user in the database
        const user = await User.findOne({ _id: userId });

        if (userId === "") {
            res.status(401).json({ status: "401", message: 'User ID Should be Entered' });
        } else if (!user) {
            res.status(401).json({ status: "401", error: 'Invalid User ID' });
            return;
        }
        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
            const hashedPassword = await bcrypt.hash(changepassword, 8);
            const updatedUserData = {
                password: hashedPassword
            }
            const updatedUser = await User.findOneAndUpdate({ _id: userId }, updatedUserData, { new: true });
            res.status(200).json({ status: "200", message: 'Success has been changed' });
            await sentVerificationEmail(user.email);

        } else {
            res.status(401).json({ status: "401", message: 'Invalid Password' });
        }
    }
    catch (error) {
        res.status(500).json({ status: "500", message: 'Something Went Wrong' });
    }
    const sentVerificationEmail = async (user) => {
        await sendEmail(user, 'verificationEmail');

    };
};

get_users = async (req, res) => {
    try {
        const userTypes = await User.find();
        res.json(userTypes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Controller to get one user type by ID
getOne_users = async (req, res) => {
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
    login,
    signup,
    forgotPassword,
    resetPassword,
    changePassword,
    get_users,
    getOne_users,
    deleteOne,
    update
}