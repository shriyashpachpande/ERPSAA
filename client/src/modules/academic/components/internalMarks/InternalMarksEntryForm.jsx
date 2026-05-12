import { useState, useEffect } from 'react';
import { useStudentSemesterEnrollments } from '../../hooks/useStudentSemesterEnrollments';
import { Check, AlertCircle } from 'lucide-react';

const InternalMarksEntryForm = ({ filters, onSave, existingMarks }) => {
  const { fetchEnrollments } = useStudentSemesterEnrollments({ fetchOnMount: false });
  const [students, setStudents] = useState([]);
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      try {
        const response = await fetchEnrollments({ sectionId: filters.sectionId });
        setStudents(response.data || []);
        
        // Initialize entries with existing values if available
        const initialEntries = {};
        response.data.forEach(s => {
          const existing = existingMarks.find(m => m.studentId?._id === s.studentId?._id);
          initialEntries[s.studentId?._id] = existing ? {
            assignmentMarks: existing.assignmentMarks,
            unitTestMarks: existing.unitTestMarks,
            practicalMarks: existing.practicalMarks,
            vivaMarks: existing.vivaMarks,
            marksStatus: existing.marksStatus,
            remarks: existing.remarks || ''
          } : {
            assignmentMarks: 0,
            unitTestMarks: 0,
            practicalMarks: 0,
            vivaMarks: 0,
            marksStatus: 'Draft',
            remarks: ''
          };
        });
        setEntries(initialEntries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (filters.sectionId) loadStudents();
  }, [filters.sectionId, existingMarks, fetchEnrollments]);

  const handleInput = (studentId, field, value) => {
    setEntries({
      ...entries,
      [studentId]: {
        ...entries[studentId],
        [field]: Number(value)
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = Object.keys(entries).map(studentId => ({
      ...filters,
      studentId,
      ...entries[studentId]
    }));
    onSave(payload);
  };

  if (loading) return <div className="p-20 text-center text-gray-400 animate-pulse">Loading section students...</div>;

  return (
    <form onSubmit={handleSubmit} className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
            <th className="px-8 py-5">Student Name</th>
            <th className="px-4 py-5 font-mono">RollNo</th>
            <th className="px-4 py-5 text-center">Assign</th>
            <th className="px-4 py-5 text-center">UTE (Unit Test)</th>
            <th className="px-4 py-5 text-center">Practical</th>
            <th className="px-4 py-5 text-center">Viva</th>
            <th className="px-4 py-5 text-center">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {students.map((enrollment) => {
            const s = enrollment.studentId;
            const entry = entries[s?._id] || {};
            const total = (entry.assignmentMarks || 0) + (entry.unitTestMarks || 0) + (entry.practicalMarks || 0) + (entry.vivaMarks || 0);

            return (
              <tr key={enrollment._id} className="hover:bg-primary-50/20">
                <td className="px-8 py-4">
                  <p className="text-sm font-bold text-gray-800">{s?.fullName}</p>
                </td>
                <td className="px-4 py-4 text-[10px] font-black text-gray-400 font-mono tracking-tight">
                  {s?.rollNumber}
                </td>
                <td className="px-4 py-4">
                  <input 
                    type="number" min="0" max="20"
                    value={entry.assignmentMarks}
                    onChange={(e) => handleInput(s._id, 'assignmentMarks', e.target.value)}
                    className="w-16 mx-auto block bg-gray-50 border-none rounded-xl px-2 py-2 text-center text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-4">
                  <input 
                    type="number" min="0" max="20"
                    value={entry.unitTestMarks}
                    onChange={(e) => handleInput(s._id, 'unitTestMarks', e.target.value)}
                    className="w-16 mx-auto block bg-gray-50 border-none rounded-xl px-2 py-2 text-center text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-4">
                  <input 
                    type="number" min="0" max="40"
                    value={entry.practicalMarks}
                    onChange={(e) => handleInput(s._id, 'practicalMarks', e.target.value)}
                    className="w-16 mx-auto block bg-gray-50 border-none rounded-xl px-2 py-2 text-center text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-4">
                  <input 
                    type="number" min="0" max="20"
                    value={entry.vivaMarks}
                    onChange={(e) => handleInput(s._id, 'vivaMarks', e.target.value)}
                    className="w-16 mx-auto block bg-gray-50 border-none rounded-xl px-2 py-2 text-center text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-4 text-center">
                   <span className="text-xs font-black text-primary-600 bg-primary-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto border border-primary-100">
                     {total}
                   </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4">
         <button 
           type="submit"
           className="px-8 py-4 bg-brand-dark text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-brand-dark/20 hover:scale-105 transition-all"
         >
           Save All Marks
         </button>
      </div>
    </form>
  );
};

export default InternalMarksEntryForm;
