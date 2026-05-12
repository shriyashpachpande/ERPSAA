import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle } from 'lucide-react';
import { useAssignedComplaintQueue } from '../../../../hooks/complaint-management/useAssignedComplaintQueue';
import ComplaintTable from '../../../../components/complaint-management/tables/ComplaintTable';

const DepartmentQueuePage = ({ status = null, all = false }) => {
    const navigate = useNavigate();
    const { queue, loading, error } = useAssignedComplaintQueue(true, status, all);

    const handleView = (id) => {
        navigate(`/app/staff/complaints/details/${id}`);
    };

    const isResolvedView = status === 'resolved';

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${
                        isResolvedView ? 'bg-emerald-50 text-emerald-600' : 
                        all ? 'bg-indigo-50 text-indigo-600' : 
                        'bg-cyan-50 text-cyan-600'
                    }`}>
                        {isResolvedView ? <CheckCircle size={28} /> : <Building2 size={28} />}
                    </div>
                    {isResolvedView ? 'Resolved Complaints' : all ? 'All Complaints' : 'Department Queue'}
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                    {isResolvedView 
                        ? 'View all successfully resolved complaints for your department' 
                        : all 
                            ? 'Complete overview of all complaints across the system'
                            : 'Shared pool of unassigned complaints for your department'}
                </p>
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

export default DepartmentQueuePage;
