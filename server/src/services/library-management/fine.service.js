const Fine = require('../../models/library-management/fines.model');
const policyService = require('./policy.service');
const auditService = require('./audit.service');
const crypto = require('crypto');

const calculateOverdueFine = async (transaction) => {
    const policy = await policyService.getActivePolicy();
    const dueDate = new Date(transaction.dueDate);
    const returnDate = transaction.returnDate ? new Date(transaction.returnDate) : new Date();
    
    if (returnDate <= dueDate) return 0;

    const diffTime = Math.abs(returnDate - dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= policy.gracePeriodDays) return 0;

    return (diffDays - policy.gracePeriodDays) * policy.overdueFinePerDay;
};

const createFine = async (data) => {
    const fineId = `FINE-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
    const fine = new Fine({
        ...data,
        fineId,
        remainingAmount: data.amount - (data.paidAmount || 0)
    });
    return await fine.save();
};

const getStudentFines = async (studentId) => {
    return await Fine.find({ studentId }).populate('bookId').sort({ createdAt: -1 });
};

const getAllFines = async () => {
    return await Fine.find().populate('studentId bookId').sort({ createdAt: -1 });
};

const collectPayment = async (fineId, amount, notes) => {
    const fine = await Fine.findById(fineId);
    if (!fine) throw new Error('Fine not found');

    fine.paidAmount += amount;
    fine.remainingAmount = fine.amount - fine.paidAmount;
    fine.notes = notes;

    if (fine.remainingAmount <= 0) {
        fine.status = 'PAID';
        fine.paidAt = new Date();
    } else {
        fine.status = 'PARTIAL';
    }

    return await fine.save();
};

const waiveFine = async (fineId, userId, reason) => {
    const fine = await Fine.findById(fineId);
    if (!fine) throw new Error('Fine not found');

    const oldStatus = fine.status;
    fine.status = 'WAIVED';
    fine.waivedBy = userId;
    fine.waiverReason = reason;
    fine.remainingAmount = 0;

    const savedFine = await fine.save();

    await auditService.logAction({
        action: 'FINE_WAIVE',
        performedBy: userId,
        targetId: fineId,
        targetType: 'Fine',
        oldValues: { status: oldStatus },
        newValues: { status: 'WAIVED', waiverReason: reason }
    });

    return savedFine;
};

module.exports = {
    calculateOverdueFine,
    createFine,
    getStudentFines,
    getAllFines,
    collectPayment,
    waiveFine
};
