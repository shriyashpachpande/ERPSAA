import { useState, useEffect } from 'react';
import complaintManagementApi from '../../api/complaint-management/complaintManagementApi';

export const useStudentComplaintStatusList = () => {
    const [statusList, setStatusList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const res = await complaintManagementApi.getMyStatus();
            if (res.data.success) {
                setStatusList(res.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch status list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return { statusList, loading, error, refresh: fetchStatus };
};
