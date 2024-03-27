const UserModel = require('./../models/Users/users.js');
const bcrypt = require('bcrypt');
const { sendEmail } = require('./sendEmail.js');
const { extractLatLongFromUrl } = require('../services/google-map-code.js');


exports.saveUser = async (Model, userData, options = {}) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 8);
        // const geoCode = await 
        let geoCode = "";
        let newUser
        if (userData.business_location) {
            const { lat, lng } = extractLatLongFromUrl(userData.business_location);
            geoCode = `${lat},${lng}`;
        }

        if (userData.user_type !== "customer") {
            newUser = new Model({
                first_name: userData.first_name,
                last_name: userData.last_name,
                contact_number: userData.contact_number,
                address: userData.address,
                password: hashedPassword,
                email: userData.email,
                cnic: userData.cnic,
                user_type: userData.user_type,
                business_name: userData.business_name,
                business_pri_num: userData.business_pri_num,
                business_sec_num: userData.business_sec_num,
                business_email: userData.business_email,
                business_web: userData.business_web,
                business_location: userData.business_location,
                business_geocode: geoCode,
                image: userData.image,
                createdAt: userData.createdAt

            });

        } else {
            newUser = new Model({
                first_name: userData.first_name,
                last_name: userData.last_name,
                contact_number: userData.contact_number,
                address: userData.address,
                password: hashedPassword,
                email: userData.email,
                cnic: userData.cnic,
                user_type: userData.user_type,
                createdAt: userData.createdAt
            });
        }

        const username = userData.email ? userData.email : "";
        const userpassword = userData.password ? userData.password : "";
        const savedUser = await newUser.save();

        if (options.sendEmail) {
            setTimeout(() => {
                sendEmail(userData.email, 'signUp', { username: userData?.email, userpassword: userData?.password });
            }, 3000);
        }

        return savedUser;
    } catch (error) {
        console.error('Save User Error:', error);
        throw new Error('Internal Server Error during user creation');
    }
};
