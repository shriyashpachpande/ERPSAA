const mongoose = require('mongoose');
require('dotenv').config();

const checkTransactions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const txns = await db.collection('issuetransactions').find({ status: { $in: ['ISSUED', 'OVERDUE'] } }).toArray();
        console.log(`ACTIVE_TXNS_COUNT: ${txns.length}`);
        txns.forEach(t => {
            console.log(`TXN_ID: ${t.transactionId}, STATUS: ${t.status}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkTransactions();
