const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const listCollections = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.forEach(c => console.log(c.name));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listCollections();
