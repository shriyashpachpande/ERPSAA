import { useState, useEffect } from 'react';
import complaintManagementApi from '../../api/complaint-management/complaintManagementApi';

export const useComplaintDetails = (id) => {
    const [complaint, setComplaint] = useState(null);
    const [timeline, setTimeline] = useState({ messages: [], audits: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const [compRes, timeRes] = await Promise.all([
                complaintManagementApi.getComplaintDetails(id),
                complaintManagementApi.getTimeline(id)
            ]);
            
            if (compRes.data.success) setComplaint(compRes.data.data);
            if (timeRes.data.success) setTimeline(timeRes.data.data);
            
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetails();
    }, [id]);

    return { complaint, timeline, loading, error, refresh: fetchDetails };
};
