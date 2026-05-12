const LibraryPolicy = require('../../models/library-management/libraryPolicy.model');
const auditService = require('./audit.service');

const getActivePolicy = async () => {
    let policy = await LibraryPolicy.findOne({ isActive: true });
    if (!policy) {
        // Create default policy if none exists
        policy = await LibraryPolicy.create({
            policyName: 'STANDARD_POLICY',
            studentMaxIssueLimit: 3,
            standardIssueDays: 14,
            referenceIssueDays: 7,
            gracePeriodDays: 2,
            overdueFinePerDay: 2,
            rareBookFinePerDay: 10,
            reservationHoldHours: 48,
            overdueBlockThreshold: 5,
            fineThresholdForIssueBlock: 100,
            isActive: true
        });
    }
    return policy;
};

const updatePolicy = async (id, data, userId) => {
    const oldPolicy = await LibraryPolicy.findById(id);
    const updatedPolicy = await LibraryPolicy.findByIdAndUpdate(id, { ...data, updatedBy: userId }, { new: true });

    if (userId) {
        await auditService.logAction({
            action: 'POLICY_UPDATE',
            performedBy: userId,
            targetId: id,
            targetType: 'LibraryPolicy',
            oldValues: oldPolicy,
            newValues: updatedPolicy
        });
    }

    return updatedPolicy;
};

const getAllPolicies = async () => {
    return await LibraryPolicy.find();
};

module.exports = {
    getActivePolicy,
    updatePolicy,
    getAllPolicies
};
