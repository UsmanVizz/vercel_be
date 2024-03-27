const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const OwnerAdd = require('../models/Owner/add_owner.js');
require('dotenv').config();
const { saveUser } = require("../services/userService.js");

const UserOTPVerification = require("../models/otpVerification.js");

const { sendEmail } = require("../services/sendEmail.js");
const { generateOTP } = require("../middleware/genrateOtp.js");



exports.login = async (req, res) => {

    try {
        // const response = req.body;
        const user = await OwnerAdd.findOne({ email: req.body.email });
        if (!req.body.email || !req.body.password) {

            return res.status(401).json({ status: 401, message: 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ status: 401, message: 'Invalid email or password' });
        }

        const payload = {
            userId: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            number: user.number,
            address: user.address,
            date: user.createdAt,
            write: user.write,
        };


        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ status: 200, token, userId: user._id, data: payload });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

exports.signup = async (req, res) => {
    try {
        const response = req.body;
        console.log("response", response);
        const existingUser = await OwnerAdd.findOne({ email: response.email });
        if (existingUser) {
            return res.status(400).json({ status: 400, error: 'Email is already in use' });
        }

        // Continue with saving the user using the saveUser service
        const savedUser = await saveUser(OwnerAdd, response, { sendEmail: true });

        res.status(200).json({
            status: 200,
            data: savedUser,
            message: 'User has been created',
        });
    } catch (error) {
        console.error('Validation or Signup Error:', error);
        res.status(400).json({ status: 400, error: 'Validation failed or internal error' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Find the user in the database
        const user = await OwnerAdd.findOne({ email: email });

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

        await sendEmail(user, 'verifyPassoword', { otpKey: oTp });

    };
};

exports.resetPassword = async (req, res) => {
  
};

exports.changePassword = async (req, res) => {
   
};
