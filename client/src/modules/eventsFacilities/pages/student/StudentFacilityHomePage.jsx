import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Mic, BookOpen, Library, ChevronRight, Activity, Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentFacilityHomePage = () => {
    const [categories, setCategories] = useState([]);
    const [facilities, setFacilities] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Build a filtered view of facilities per category based on search query
    const query = searchQuery.trim().toLowerCase();
    const filteredFacilities = Object.fromEntries(
        Object.entries(facilities).map(([slug, facs]) => [
            slug,
            query ? facs.filter(f => f.name.toLowerCase().includes(query)) : facs
        ])
    );
    const totalResults = Object.values(filteredFacilities).reduce((acc, facs) => acc + facs.length, 0);

    const iconMap = {
        'Trophy': Trophy,
        'Mic': Mic,
        'BookOpen': BookOpen,
        'Library': Library
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const catRes = await fetch('/api/eventsFacilities/catalog/categories', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const catData = await catRes.json();

            if (catData.success) {
                setCategories(catData.data);

                // Fetch facilities for each category instantly to display on the same page
                const facilityPromises = catData.data.map(cat =>
                    fetch(`/api/eventsFacilities/catalog/categories/${cat.slug}/facilities`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(res => res.json())
                );

                const results = await Promise.all(facilityPromises);
                let facMap = {};
                results.forEach((res, index) => {
                    if (res.success) {
                        // using category slug as key
                        facMap[catData.data[index].slug] = res.data;
                    }
                });
                setFacilities(facMap);
            }
        } catch (error) {
            toast.error('Failed to load facility catalog.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-50">
                <Activity className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden rounded-tl-2xl border-l border-slate-200 bg-transparent">

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20 bg-transparent"></div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">

                <header className="border-b border-slate-200/60 pb-8">
                    {/* Top row: badge + search bar inline */}
                    <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Campus Facility Catalog</span>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full max-w-sm">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search facilities..."
                                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all"
                            />
                            {searchQuery && (
                                <button type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-3 text-slate-900">Campus Facilities</h1>
                    <p className="text-slate-500 text-lg font-medium max-w-3xl">Browse and book premium sports arenas, event spaces, academic labs, and study rooms located across the campus grounds.</p>

                    {query && (
                        <p className="mt-3 text-sm font-medium text-slate-500">
                            {totalResults > 0
                                ? <>{totalResults} result{totalResults !== 1 ? 's' : ''} for <span className="text-blue-600 font-bold">&ldquo;{searchQuery}&rdquo;</span></>
                                : <>No facilities found for <span className="text-rose-500 font-bold">&ldquo;{searchQuery}&rdquo;</span></>}
                        </p>
                    )}
                </header>

                <div className="space-y-16">
                    {query && totalResults === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-700 mb-2">No Facilities Found</h3>
                            <p className="text-slate-400 font-medium">Try a different name or <button type="button" onClick={() => setSearchQuery('')} className="text-blue-500 hover:underline font-bold">clear the search</button>.</p>
                        </div>
                    ) : (
                        categories.map((cat, idx) => {
                            const IconComponent = iconMap[cat.icon] || Calendar;
                            const categoryFacilities = filteredFacilities[cat.slug] || [];

                            // Hide entire category section when it has no matching facilities
                            if (query && categoryFacilities.length === 0) return null;

                            return (
                                <section key={cat._id} className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}>
                                    <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight text-slate-900">{cat.name}</h2>
                                            <p className="text-sm font-medium text-slate-500">{cat.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                        {categoryFacilities.map(facility => (
                                            <Link to={`/app/student/events/facilities/${facility.slug}`} key={facility._id} className="group flex flex-col bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">

                                                <div className="h-40 bg-slate-100 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                        <IconComponent className="w-16 h-16 text-slate-300/50" />
                                                    </div>
                                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg border border-white/20 shadow-sm">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Capacity: {facility.capacity || 'N/A'}</span>
                                                    </div>
                                                </div>

                                                <div className="p-6 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{facility.name}</h3>
                                                        <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-2">Available for student bookings throughout the standard operational window.</p>
                                                    </div>

                                                    <div className="inline-flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                                                        View Schedule &amp; Book <ChevronRight className="w-4 h-4 ml-1" />
                                                    </div>
                                                </div>

                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
};

export default StudentFacilityHomePage;
