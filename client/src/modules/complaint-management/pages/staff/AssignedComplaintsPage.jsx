import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, LayoutGrid } from 'lucide-react';
import { useAssignedComplaintQueue } from '../../../../hooks/complaint-management/useAssignedComplaintQueue';
import ComplaintTable from '../../../../components/complaint-management/tables/ComplaintTable';

const AssignedComplaintsPage = () => {
    const navigate = useNavigate();
    const { queue, loading, error } = useAssignedComplaintQueue(false);

    const handleView = (id) => {
        navigate(`/app/staff/complaints/details/${id}`);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                        <Inbox size={28} />
                    </div>
                    Assigned to Me
                </h1>
                <p className="text-slate-500 font-medium mt-1">Manage tasks specifically allocated to you</p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                <ComplaintTable 
                    complaints={queue} 
                    onView={handleView} 
                    isLoading={loading} 
                />
            </div>
        </div>
    );
};

export default AssignedComplaintsPage;
