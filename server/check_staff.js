const mongoose = require('mongoose');
const User = require('./src/models/auth/User');
require('dotenv').config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const staff = await User.findOne({ role: 'admission_staff' });
        if (staff) {
            console.log('FOUND_STAFF:', JSON.stringify({ email: staff.email, username: staff.username }));
        } else {
            console.log('NO_STAFF_FOUND');
            // Create a test staff user
            const newStaff = await User.create({
                fullName: 'Test Admission Staff',
                email: 'staff@test.com',
                username: 'staff_test',
                password: 'password123',
                role: 'admission_staff',
                isActive: true
            });
            console.log('CREATED_STAFF:', JSON.stringify({ email: newStaff.email, password: 'password123' }));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
