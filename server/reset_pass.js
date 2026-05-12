const mongoose = require('mongoose');
const User = require('./src/models/auth/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'admissions@erpsaa.edu' });
        if (user) {
            user.password = 'password123';
            await user.save();
            console.log('PASSWORD_RESET_SUCCESS');
        } else {
            console.log('USER_NOT_FOUND');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetPassword();
