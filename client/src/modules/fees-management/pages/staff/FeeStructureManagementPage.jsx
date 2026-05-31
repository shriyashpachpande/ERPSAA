import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Plus, 
    Search, 
    Filter, 
    Edit2, 
    Trash2, 
    BookOpen, 
    Calendar,
    ArrowRight,
    Loader2,
    DollarSign,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import gsap from 'gsap';

const FeeStructureManagementPage = () => {
    const [structures, setStructures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseFilter, setCourseFilter] = useState('All');

    const courses = ['All', 'B.Tech', 'M.Tech', 'BCA', 'MCA', 'BSc', 'MSc', 'BBA', 'MBA', 'BCom', 'BA', 'Diploma'];

    const fetchStructures = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/fees/staff/fee-structures', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStructures(res.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch fee structures');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStructures();
    }, []);

    useEffect(() => {
        if (!loading) {
            gsap.fromTo(".structure-card", 
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power2.out",
                    clearProps: "all"
                }
            );
        }
    }, [loading, searchTerm, courseFilter]);

    const filteredStructures = structures.filter(s => {
        const matchesSearch = s.course.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = courseFilter === 'All' || s.course === courseFilter;
        return matchesSearch && matchesCourse;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Fee Architectures...</p>
        </div>
    );

    return (
        <div className="p-8 space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Fee Structure.</h1>
                    <p className="text-sm font-medium text-gray-500">Define and manage institutional pricing across all departments.</p>
                </div>
                <button type="button" className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="w-4 h-4" /> Define New Structure
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-wrap items-center gap-6">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by course name..."
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {courses.map(course => (
                        <button type="button"
                            key={course}
                            onClick={() => setCourseFilter(course)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                courseFilter === course 
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            {course}
                        </button>
                    ))}
                </div>
            </div>

            {/* Structures Grid */}
            {filteredStructures.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStructures.map((structure) => (
                        <div 
                            key={structure._id} 
                            className="structure-card group bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] scale-150 rotate-12 group-hover:scale-[1.7] transition-transform duration-700 pointer-events-none">
                                <BookOpen className="w-32 h-32" />
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="p-4 bg-primary-50 rounded-2xl text-primary-600">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        {structure.isActive && (
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button type="button" className="p-2 text-gray-400 hover:text-rose-600 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary-600 transition-colors">
                                        {structure.course}
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
                                        Year {structure.yearNumber} • {structure.academicYear}
                                    </p>
                                </div>

                                <div className="p-6 bg-gray-50/50 rounded-3xl space-y-4 font-bold border border-gray-100 group-hover:border-primary-100 group-hover:bg-primary-50/10 transition-all">
                                    <div className="flex justify-between items-center text-gray-900">
                                        <span className="text-xs text-gray-500 uppercase tracking-widest">Pricing Model</span>
                                        <span className="text-lg font-black">₹{structure.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-gray-200"></div>
                                    <div className="space-y-2">
                                        {structure.components.map((comp, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-[10px]">
                                                <span className="text-gray-500">{comp.name}</span>
                                                <span className="text-gray-900">₹{comp.amount.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="button" 
                                    onClick={() => window.location.href = `/app/staff/fees/structures/analysis/${structure._id}`}
                                    className="w-full flex items-center justify-between px-6 py-4 bg-gray-900 border border-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-black transition-all shadow-lg hover:shadow-primary-500/20 active:scale-[0.98]"
                                >
                                    Analyze Impact <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-10 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 space-y-4">
                    <AlertCircle className="w-12 h-12 text-gray-300" />
                    <div className="text-center">
                        <h3 className="text-xl font-black text-gray-900 italic">No structure found.</h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Refine your filters or create a new definition.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeStructureManagementPage;
