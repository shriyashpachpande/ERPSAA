import { useState, useEffect } from 'react';
import complaintManagementApi from '../../api/complaint-management/complaintManagementApi';

export const useAssignedComplaintQueue = (isDepartment = false, status = null, all = false) => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQueue = async () => {
        try {
            setLoading(true);
            const res = isDepartment 
                ? await complaintManagementApi.getDepartmentQueue(status, all) 
                : await complaintManagementApi.getAssignedQueue(status);
            
            if (res.data.success) {
                setQueue(res.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch queue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, [isDepartment, status, all]);

    return { queue, loading, error, refresh: fetchQueue };
};
