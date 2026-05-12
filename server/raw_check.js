const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const check = async () => {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db();
        console.log('Connected to DB:', db.databaseName);

        const targetBookId = '69d36a902abae1d7ee5de7';
        console.log('Target Book ID:', targetBookId);

        // 1. Check Book
        const book = await db.collection('books').findOne({ _id: new ObjectId(targetBookId) });
        console.log('Book found:', book ? 'YES' : 'NO');
        if (book) {
            console.log('Book _id type:', typeof book._id, book._id.constructor.name);
        }

        // 2. Check Copies (Raw)
        const allCopies = await db.collection('bookcopies').find({}).toArray();
        console.log('Total copies in collection:', allCopies.length);
        
        const matchingCopiesObj = await db.collection('bookcopies').find({ bookId: new ObjectId(targetBookId) }).toArray();
        console.log('Matching copies (ObjectId search):', matchingCopiesObj.length);

        const matchingCopiesStr = await db.collection('bookcopies').find({ bookId: targetBookId }).toArray();
        console.log('Matching copies (String search):', matchingCopiesStr.length);

        if (allCopies.length > 0) {
            console.log('Sample copy bookId type:', typeof allCopies[0].bookId, allCopies[0].bookId.constructor.name);
            console.log('Sample copy status:', allCopies[0].status);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
