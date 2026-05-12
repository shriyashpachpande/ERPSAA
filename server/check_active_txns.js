const mongoose = require('mongoose');
require('dotenv').config();

const checkTransactions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const IssueTransaction = mongoose.model('IssueTransaction', new mongoose.Schema({}, { strict: false }));
        const transactions = await IssueTransaction.find({ status: { $in: ['ISSUED', 'OVERDUE'] } });
        
        console.log(`Found ${transactions.length} active transactions`);
        transactions.forEach(t => {
            console.log(`ID: ${t.transactionId}, Student: ${t.studentId}, Book: ${t.bookId}, Status: ${t.status}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkTransactions();
