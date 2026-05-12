const mongoose = require('mongoose');
const User = require('../models/auth/User');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedLibraryStaff = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding library_staff...');

        // Check if librarian already exists
        const existingStaff = await User.findOne({ email: 'librarian@erpsaa.com' });
        if (existingStaff) {
            console.log('Librarian account already exists. Skipping...');
            process.exit();
        }

        // Create librarian account
        const librarian = await User.create({
            fullName: 'Default Librarian',
            email: 'librarian@erpsaa.com',
            password: 'password123', // Will be hashed by pre-save hook
            role: 'library_staff',
            isActive: true,
            mustChangePassword: false
        });

        console.log('Library Staff Seeded Successfully:', librarian.email);
        process.exit();
    } catch (err) {
        console.error('Error seeding library staff:', err);
        process.exit(1);
    }
};

seedLibraryStaff();
