import { useState, useEffect } from 'react';
import complaintManagementApi from '../../api/complaint-management/complaintManagementApi';

export const useComplaintAnalyticsSummary = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await complaintManagementApi.getAnalytics();
            if (res.data.success) {
                setAnalytics(res.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return { analytics, loading, error, refresh: fetchAnalytics };
};
