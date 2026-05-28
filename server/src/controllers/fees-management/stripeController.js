const Stripe = require('stripe');
const StudentFeeAccount = require('../../models/fees-management/StudentFeeAccount');
const FeePaymentEntry = require('../../models/fees-management/FeePaymentEntry');
const DigitalReceipt = require('../../models/fees-management/DigitalReceipt');

// Initialize stripe controller
const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        throw new Error('STRIPE_SECRET_KEY is not defined in your backend .env file. Please add it to start real payments.');
    }
    return new Stripe(key);
};

/**
 * @desc Create a real Stripe Checkout Session for fee payment
 * @route POST /api/fees/payments/create-checkout-session
 * @access Private (Student)
 */
exports.createCheckoutSession = async (req, res) => {
    try {
        const { feeAccountId, installmentId, amount } = req.body;

        if (!feeAccountId || !installmentId || !amount) {
            return res.status(400).json({ success: false, error: 'Please provide feeAccountId, installmentId, and amount' });
        }

        const stripe = getStripe();
        const account = await StudentFeeAccount.findById(feeAccountId);
        if (!account) {
            return res.status(404).json({ success: false, error: 'Student fee account not found' });
        }

        const origin = req.headers.origin || 'http://localhost:5173';

        // Create checkout session on Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Tuition Fee Clearance',
                        description: `Secure ERPSAA Fee Installment Payment`,
                    },
                    unit_amount: Math.round(Number(amount) * 100), // Cents/paise representation
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${origin}/app/student/fees?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/app/student/fees?cancel=true`,
            metadata: {
                feeAccountId: feeAccountId.toString(),
                installmentId: installmentId.toString(),
                amount: amount.toString()
            }
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (err) {
        console.error('Stripe Session Creation Failed:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * @desc Verify Checkout Session and post payment transaction instantly to ledger
 * @route POST /api/fees/payments/verify-checkout-session
 * @access Private (Student)
 */
exports.verifyCheckoutSession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ success: false, error: 'Please provide a valid Stripe session ID' });
        }

        const stripe = getStripe();
        
        // Retrieve session with payment data
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) {
            return res.status(404).json({ success: false, error: 'Stripe session not found' });
        }

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ success: false, error: 'Transaction is not paid' });
        }

        const { feeAccountId, installmentId, amount } = session.metadata;

        // Prevent double recording of the same transaction (idempotent safeguard)
        const stripeTxId = session.payment_intent || session.id;
        const existingPayment = await FeePaymentEntry.findOne({ transactionId: stripeTxId });
        
        if (existingPayment) {
            // Already recorded, return current account data
            const account = await StudentFeeAccount.findById(feeAccountId);
            return res.status(200).json({ success: true, alreadyProcessed: true, account });
        }

        // Record the new captured payment
        const account = await StudentFeeAccount.findById(feeAccountId);
        if (!account) {
            return res.status(404).json({ success: false, error: 'Student fee account not found' });
        }

        // Find the installment and mark as paid
        const installment = account.installments.id(installmentId) || account.installments.find(i => i._id.toString() === installmentId);
        if (installment) {
            installment.status = 'paid';
        }

        // Update overall paid status
        account.totalPaid += Number(amount);
        account.balance = Math.max(0, account.totalPayable - account.totalPaid);
        if (account.balance === 0) {
            account.status = 'paid';
        } else {
            account.status = 'partial';
        }

        await account.save();

        // Create transaction entry
        const paymentEntry = await FeePaymentEntry.create({
            feeAccountId,
            amount: Number(amount),
            paymentDate: new Date(),
            paymentMode: 'online',
            transactionId: stripeTxId,
            remarks: 'Stripe Secure Online Checkout Capture.',
            receivedBy: req.user._id
        });

        // Create dynamic digital receipt
        const receiptCount = await DigitalReceipt.countDocuments();
        const receiptNumber = `REC-${new Date().getFullYear()}-${10000 + receiptCount + 1}`;
        await DigitalReceipt.create({
            paymentEntryId: paymentEntry._id,
            studentId: account.studentId,
            receiptNumber,
            generatedAt: new Date()
        });

        res.status(200).json({ success: true, account });
    } catch (err) {
        if (err.code === 11000 || err.message.includes('E11000')) {
            try {
                // If it's a duplicate key, the entry already exists. Return success state.
                const { feeAccountId } = req.body.sessionId ? await stripe.checkout.sessions.retrieve(req.body.sessionId).then(s => s.metadata) : req.body;
                const account = await StudentFeeAccount.findById(feeAccountId);
                return res.status(200).json({ success: true, alreadyProcessed: true, account });
            } catch (innerErr) {
                // Fallback if Stripe retrieval fails
            }
        }
        console.error('Stripe Session Verification Failed:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};
