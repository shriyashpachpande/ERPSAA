const dotenv = require('dotenv');
dotenv.config();

console.log('LOADED STRIPE KEY:', process.env.STRIPE_SECRET_KEY);
