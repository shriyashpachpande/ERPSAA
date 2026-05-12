const policyService = require('../../services/library-management/policy.service');

const getActivePolicy = async (req, res) => {
    try {
        const policy = await policyService.getActivePolicy();
        res.status(200).json({ success: true, data: policy });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const updatePolicy = async (req, res) => {
    try {
        const policy = await policyService.updatePolicy(req.params.id, req.body, req.user._id);
        res.status(200).json({ success: true, data: policy });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const getAllPolicies = async (req, res) => {
    try {
        const policies = await policyService.getAllPolicies();
        res.status(200).json({ success: true, data: policies });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = {
    getActivePolicy,
    updatePolicy,
    getAllPolicies
};
