import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import StudentSemesterEnrollmentForm from '../components/studentSemesterEnrollments/StudentSemesterEnrollmentForm';
import { useStudentSemesterEnrollments } from '../hooks/useStudentSemesterEnrollments';
import API from '../../../utils/axiosInstance';

const NewEnrollmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const academicYearId = queryParams.get('yearId') || '';
  const semesterId = queryParams.get('semesterId') || '';

  const { enrollStudent, updateEnrollment } = useStudentSemesterEnrollments({});
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const fetchEnrollment = async () => {
        try {
          const response = await API.get(`/academic/enrollments/${id}`);
          setEditingEnrollment(response.data.data);
        } catch (err) {
          console.error('Failed to fetch enrollment detail', err);
          alert('Error loading enrollment data');
          navigate('/app/academic/enrollments');
        } finally {
          setLoading(false);
        }
      };
      fetchEnrollment();
    }
  }, [id, navigate]);

  const handleFormSubmit = async (data) => {
    try {
      if (id) {
        await updateEnrollment(id, data);
      } else {
        await enrollStudent(data);
      }
      navigate('/app/academic/enrollments');
    } catch (err) {
      console.error('Submission failed', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-[calc(100vh-80px)] bg-slate-50/50 p-4 lg:p-6 overflow-hidden flex flex-col">
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full max-h-[calc(100vh-120px)]">
        <StudentSemesterEnrollmentForm 
          initialData={editingEnrollment}
          onClose={() => navigate('/app/academic/enrollments')}
          onSubmit={handleFormSubmit}
          academicYearId={academicYearId}
          semesterId={semesterId}
        />
      </div>
    </div>
  );
};

export default NewEnrollmentPage;
