const mongoose = require('mongoose');
const BookCopy = require('./models/library-management/bookCopies.model');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('BookCopy collection name:', BookCopy.collection.name);
        
        const count = await BookCopy.countDocuments();
        console.log('Total BookCopy documents:', count);
        
        if (count > 0) {
            const first = await BookCopy.findOne();
            console.log('Sample BookCopy:', {
                status: first.status,
                bookId: first.bookId,
                bookIdType: typeof first.bookId,
                isObjectId: first.bookId instanceof mongoose.Types.ObjectId
            });
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
