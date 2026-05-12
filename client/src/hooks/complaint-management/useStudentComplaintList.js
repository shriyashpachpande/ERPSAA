import { useState, useEffect } from 'react';
import complaintManagementApi from '../../api/complaint-management/complaintManagementApi';

export const useStudentComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const res = await complaintManagementApi.getMyComplaints();
            if (res.data.success) {
                setComplaints(res.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    return { complaints, loading, error, refresh: fetchComplaints };
};
