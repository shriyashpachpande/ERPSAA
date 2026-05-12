const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hostel = require('./src/models/hostel-management/Hostel');
const HostelBlock = require('./src/models/hostel-management/HostelBlock');
const HostelFloor = require('./src/models/hostel-management/HostelFloor');
const HostelRoom = require('./src/models/hostel-management/HostelRoom');
const HostelBed = require('./src/models/hostel-management/HostelBed');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const hostels = await Hostel.find();
        const blocks = await HostelBlock.find();
        const floors = await HostelFloor.find();
        const rooms = await HostelRoom.find();
        const beds = await HostelBed.find();

        console.log('--- DATABASE DIAGNOSTIC ---');
        console.log(`Hostels: ${hostels.length}`);
        console.log(`Blocks: ${blocks.length}`);
        console.log(`Floors: ${floors.length}`);
        console.log(`Rooms: ${rooms.length}`);
        console.log(`Beds: ${beds.length}`);
        
        if (hostels.length > 0) {
            console.log('\nHostel List:');
            hostels.forEach(h => console.log(`- ${h.name} (_id: ${h._id}, isActive: ${h.isActive})`));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
