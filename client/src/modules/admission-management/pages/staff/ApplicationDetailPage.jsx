import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, ShieldCheck, Mail, Phone, Calendar, MapPin, Briefcase, GraduationCap, FileCheck, ExternalLink, Image, FileText } from 'lucide-react';

// const API = 'http://localhost:5000'; // Removed

import { getFileUrl } from '../../../../utils/fileUrlResolver';

// resolveUrl is now handled by the centralized getFileUrl
const resolveUrl = (urlOrPath) => getFileUrl(urlOrPath);


const DOC_LIST = [
    { key: 'tenthMarksheet', label: '10th Marksheet' },
    { key: 'twelfthMarksheet', label: '12th Marksheet' },
    { key: 'transferCertificate', label: 'Transfer Certificate' },
    { key: 'migrationCertificate', label: 'Migration Certificate' },
    { key: 'casteCertificate', label: 'Caste Certificate' },
    { key: 'incomeCertificate', label: 'Income Certificate' },
    { key: 'passportPhoto', label: 'Passport Photo' },
    { key: 'idProof', label: 'ID Proof' },
    { key: 'domicileCertificate', label: 'Domicile Certificate' },
    { key: 'entranceScorecard', label: 'Entrance Scorecard' },
    { key: 'disabilityCertificate', label: 'Disability Certificate' },
];

const SectionHeader = ({ title, icon: Icon }) => (
    <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center mr-3 text-primary-600">
            <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
);

const DataRow = ({ label, value }) => (
    <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
        <p className="font-medium text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100">{value || 'N/A'}</p>
    </div>
);

const ApplicationDetailPage = () => {
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/admissions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setApplication(res.data.data);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, [id]);

    if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
    if (!application) return <div className="p-8 text-center text-red-500">Application not found.</div>;

    const { personalDetails, addressDetails, academicDetails, courseSelection, guardianDetails, applicationStatus, uploadedDocuments = {} } = application;


    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link to="/app/staff/admissions" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-3">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Queue
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Application {application.applicationId}</h1>
                    <p className="text-gray-500 font-medium">Detailed Applicant Record View.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="px-4 py-2 bg-gray-100 text-gray-700 font-bold uppercase tracking-wider text-xs rounded-lg border border-gray-200">
                        Status: {applicationStatus.replace(/_/g, ' ')}
                    </span>
                    <Link
                        to={`/app/staff/admissions/review/${application._id}`}
                        className="flex items-center px-6 py-2 bg-brand-dark text-white rounded-xl shadow-lg hover:bg-black font-semibold transition-colors"
                    >
                        <ShieldCheck className="w-4 h-4 mr-2" /> Take Action
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-12">

                {/* Section A – Personal */}
                <section>
                    <SectionHeader title="Personal Details" icon={ShieldCheck} />

                    {/* Profile Photo at top */}
                    {personalDetails?.profilePhotoUrl && (
                        <div className="mb-6 flex items-center space-x-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <img src={resolveUrl(personalDetails.profilePhotoUrl)} alt="Applicant" className="w-20 h-20 rounded-2xl object-cover border border-gray-200" />
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Profile Photo</p>
                                <p className="text-lg font-bold text-gray-900">{personalDetails?.fullName}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DataRow label="Full Name" value={personalDetails?.fullName} />
                        <DataRow label="Father's Name" value={personalDetails?.fatherName} />
                        <DataRow label="Mother's Name" value={personalDetails?.motherName} />
                        <DataRow label="Gender" value={personalDetails?.gender} />
                        <DataRow label="Date of Birth" value={personalDetails?.dateOfBirth ? new Date(personalDetails.dateOfBirth).toLocaleDateString() : 'N/A'} />
                        <DataRow label="Blood Group" value={personalDetails?.bloodGroup} />
                        <DataRow label="Nationality" value={personalDetails?.nationality} />
                        <DataRow label="Category" value={personalDetails?.category} />
                        <DataRow label="Religion" value={personalDetails?.religion} />
                        <DataRow label="Aadhaar / ID" value={personalDetails?.aadhaarId} />
                    </div>
                </section>

                {/* Section B – Contact */}
                <section>
                    <SectionHeader title="Contact & Address" icon={MapPin} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <DataRow label="Mobile Number" value={personalDetails?.mobileNumber} />
                        <DataRow label="Alternate Mobile" value={personalDetails?.alternateMobile} />
                        <DataRow label="Email Address" value={personalDetails?.email} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2"><MapPin className="w-4 h-4 mr-2 text-primary-600" />Current Address</h4>
                            <p className="text-gray-700 font-medium leading-relaxed">
                                {addressDetails?.current?.addressLine1}<br />
                                {addressDetails?.current?.addressLine2 && <>{addressDetails.current.addressLine2}<br /></>}
                                City: {addressDetails?.current?.city}<br />
                                District: {addressDetails?.current?.district}<br />
                                State: {addressDetails?.current?.state}<br />
                                Pincode: {addressDetails?.current?.pincode}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2"><MapPin className="w-4 h-4 mr-2 text-primary-600" />Permanent Address</h4>
                            <p className="text-gray-700 font-medium leading-relaxed">
                                {addressDetails?.permanentSameAsCurrent ? (
                                    <span className="text-gray-500 italic">Same as Current Address</span>
                                ) : (
                                    <>
                                        {addressDetails?.permanent?.addressLine1}<br />
                                        {addressDetails?.permanent?.addressLine2 && <>{addressDetails.permanent.addressLine2}<br /></>}
                                        City: {addressDetails?.permanent?.city}<br />
                                        District: {addressDetails?.permanent?.district}<br />
                                        State: {addressDetails?.permanent?.state}<br />
                                        Pincode: {addressDetails?.permanent?.pincode}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section C – Academic */}
                <section>
                    <SectionHeader title="Academic Record" icon={GraduationCap} />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
                        <div className="col-span-4 md:col-span-1 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 pr-0 md:pr-4">
                            <h4 className="font-bold text-gray-900 mb-2">10th Standard</h4>
                            <p className="text-sm text-gray-500">Board: <span className="font-semibold text-gray-800">{academicDetails?.tenthBoard}</span></p>
                            <p className="text-sm text-gray-500">Passing Year: <span className="font-semibold text-gray-800">{academicDetails?.tenthPassingYear}</span></p>
                            <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg text-center">
                                <p className="text-xs text-gray-500 font-semibold uppercase">Score / CGPA</p>
                                <p className="text-xl font-bold text-brand-dark">{academicDetails?.tenthScore}</p>
                            </div>
                        </div>
                        <div className="col-span-4 md:col-span-3 grid grid-cols-1 gap-6">
                            <DataRow label="School Name" value={academicDetails?.tenthSchool} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
                        <div className="col-span-4 md:col-span-1 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 pr-0 md:pr-4">
                            <h4 className="font-bold text-gray-900 mb-2">12th Standard</h4>
                            <p className="text-sm text-gray-500">Board: <span className="font-semibold text-gray-800">{academicDetails?.twelfthBoard}</span></p>
                            <p className="text-sm text-gray-500">Passing Year: <span className="font-semibold text-gray-800">{academicDetails?.twelfthPassingYear}</span></p>
                            <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg text-center">
                                <p className="text-xs text-gray-500 font-semibold uppercase">Score / CGPA</p>
                                <p className="text-xl font-bold text-brand-dark">{academicDetails?.twelfthScore}</p>
                            </div>
                        </div>
                        <div className="col-span-4 md:col-span-3 grid grid-cols-1 gap-6">
                            <DataRow label="College Name" value={academicDetails?.twelfthCollege} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DataRow label="Entrance Exam Name" value={academicDetails?.entranceExamName} />
                        <DataRow label="Entrance Score" value={academicDetails?.entranceScore} />
                        <DataRow label="All India Rank" value={academicDetails?.rank} />
                        <DataRow label="Previous College (Lateral)" value={academicDetails?.previousCollege} />
                        <DataRow label="Transfer Certificate" value={academicDetails?.transferCertificateNumber} />
                    </div>
                </section>

                {/* Section D – Course */}
                <section>
                    <SectionHeader title="Course Selection" icon={Briefcase} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <DataRow label="Program Type" value={courseSelection?.programType} />
                        <DataRow label="Department" value={courseSelection?.department} />
                        <DataRow label="Course Specialization" value={`${courseSelection?.course || ''} - ${courseSelection?.specialization || ''}`} />
                        <DataRow label="Admission Type" value={courseSelection?.admissionType} />
                        <DataRow label="Category Quota" value={courseSelection?.categoryQuota} />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${courseSelection?.preferredHostel ? 'bg-primary-50 text-primary-700 border-primary-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>Requires Hostel: {courseSelection?.preferredHostel ? 'Yes' : 'No'}</span>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${courseSelection?.scholarshipApplied ? 'bg-primary-50 text-primary-700 border-primary-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>Scholarship Applied: {courseSelection?.scholarshipApplied ? 'Yes' : 'No'}</span>
                    </div>
                </section>

                {/* Section E – Guardian */}
                <section>
                    <SectionHeader title="Guardian & Emergency" icon={ShieldCheck} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DataRow label="Guardian Name" value={guardianDetails?.guardianName} />
                        <DataRow label="Guardian Relation" value={guardianDetails?.guardianRelation} />
                        <DataRow label="Guardian Phone" value={guardianDetails?.guardianPhone} />
                        <DataRow label="Guardian Occupation" value={guardianDetails?.guardianOccupation} />
                        <DataRow label="Emergency Contact" value={guardianDetails?.emergencyContactName} />
                        <DataRow label="Emergency Phone" value={guardianDetails?.emergencyContactPhone} />
                        <DataRow label="Emergency Relation" value={guardianDetails?.emergencyContactRelation} />
                    </div>
                </section>

                {/* Section F – Documents (Rich) */}
                <section>
                    <SectionHeader title="Uploaded Documents" icon={FileCheck} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {DOC_LIST.map(doc => {
                            const meta = uploadedDocuments?.[doc.key];
                            const isUploaded = !!meta?.filePath;
                            const isImage = meta?.mimeType?.startsWith('image/');
                            const fileUrl = isUploaded ? resolveUrl(meta.filePath) : null;

                            return (
                                <div key={doc.key} className={`bg-white border rounded-2xl overflow-hidden ${isUploaded ? 'border-green-200' : 'border-gray-100'}`}>
                                    {/* Thumbnail for images */}
                                    {isUploaded && isImage && (
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            <img src={fileUrl} alt={doc.label} className="w-full h-24 object-cover" />
                                        </a>
                                    )}
                                    <div className="p-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-semibold text-gray-800">{doc.label}</span>
                                            {isUploaded ? (
                                                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                                            ) : (
                                                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold shrink-0">–</span>
                                            )}
                                        </div>
                                        {isUploaded ? (
                                            <>
                                                <p className="text-xs text-gray-400 truncate" title={meta.originalName}>{meta.originalName}</p>
                                                <p className="text-xs text-gray-300 mb-2">{new Date(meta.uploadedAt).toLocaleDateString()}</p>
                                                <div className="flex flex-col gap-1.5 mt-2">
                                                    <a
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider"
                                                    >
                                                        <ExternalLink className="w-3 h-3 mr-1" /> View {isImage ? 'Image' : 'Doc'}
                                                    </a>
                                                    <a
                                                        href={fileUrl}
                                                        download={meta.originalName}
                                                        className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest"
                                                    >
                                                        Download
                                                    </a>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">Not yet uploaded</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ApplicationDetailPage;
