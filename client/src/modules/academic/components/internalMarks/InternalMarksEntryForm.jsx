import React, { useState, useEffect, useCallback } from 'react';
import { useStudentSemesterEnrollments } from '../../hooks/useStudentSemesterEnrollments';
import { Check, AlertCircle } from 'lucide-react';

const StudentRow = React.memo(({ enrollment, index, entry, handleInput }) => {
  const s = enrollment.studentMasterId;
  const total = (entry.pt1Marks || 0) + (entry.mseMarks || 0) + (entry.pt2Marks || 0) + (entry.semMarks || 0);

  return (
    <tr className="hover:bg-primary-50/20 transition-colors">
      <td className="px-6 py-4 text-center text-xs font-bold text-gray-400">
        {index + 1}
      </td>
      <td className="px-8 py-4">
        <p className="text-sm font-bold text-gray-800">{s?.personalDetails?.fullName}</p>
      </td>
      <td className="px-4 py-4 text-[10px] font-black text-gray-400 font-mono tracking-tight">
        {s?.studentId}
      </td>
      <td className="px-4 py-4">
        <input 
          type="number" min="0" max="20"
          value={entry.pt1Marks === 0 ? '' : entry.pt1Marks}
          onChange={(e) => handleInput(s._id, 'pt1Marks', e.target.value)}
          placeholder="0"
          className="w-16 mx-auto block bg-gray-50 border-none rounded-xl px-2 py-2 text-center text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500"
        />
      </td>
      <td className="px-4 py-4">
        <input 
          type="number" min="0" max="20"
          value={entry.mseMarks === 0 ? '' : entry.mseMarks}
          onChange={(e) => handleInput(s._id, 'mseMarks', e.target.value)}
          placeholder="0"
          className="w-16 mx-auto block bg-gray-50 border-none rounded-xl px-2 py-2 text-center text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500"
        />
      </td>
      <td className="px-4 py-4">
        <input 
          type="number" min="0" max="20"
          value={entry.pt2Marks === 0 ? '' : entry.pt2Marks}
          onChange={(e) => handleInput(s._id, 'pt2Marks', e.target.value)}
          placeholder="0"
          className="w-16 mx-auto block bg-gray-50 border-none rounded-xl px-2 py-2 text-center text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500"
        />
      </td>
      <td className="px-4 py-4">
        <input 
          type="number" min="0" max="60"
          value={entry.semMarks === 0 ? '' : entry.semMarks}
          onChange={(e) => handleInput(s._id, 'semMarks', e.target.value)}
          placeholder="0"
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
});

StudentRow.displayName = 'StudentRow';

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
          const existing = existingMarks.find(m => m.studentMasterId?._id === s.studentMasterId?._id);
          initialEntries[s.studentMasterId?._id] = existing ? {
            pt1Marks: existing.pt1Marks || 0,
            mseMarks: existing.mseMarks || 0,
            pt2Marks: existing.pt2Marks || 0,
            semMarks: existing.semMarks || 0,
            marksStatus: existing.marksStatus || 'Submitted',
            remarks: existing.remarks || ''
          } : {
            pt1Marks: 0,
            mseMarks: 0,
            pt2Marks: 0,
            semMarks: 0,
            marksStatus: 'Submitted',
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

  const handleInput = useCallback((studentId, field, value) => {
    setEntries(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: Number(value)
      }
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = Object.keys(entries).map(studentId => ({
      ...filters,
      studentMasterId: studentId,
      ...entries[studentId],
      marksStatus: 'Submitted'
    }));
    onSave(payload);
  };

  if (loading) return <div className="p-20 text-center text-gray-400 animate-pulse">Loading section students...</div>;

  return (
    <form onSubmit={handleSubmit} className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
            <th className="px-6 py-5 text-center w-12">S.No.</th>
            <th className="px-8 py-5">Student Name</th>
            <th className="px-4 py-5 font-mono">RollNo</th>
            <th className="px-4 py-5 text-center">PT1 (20)</th>
            <th className="px-4 py-5 text-center">MSE (20)</th>
            <th className="px-4 py-5 text-center">PT2 (20)</th>
            <th className="px-4 py-5 text-center">SEM (60)</th>
            <th className="px-4 py-5 text-center">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {students.map((enrollment, index) => {
            const s = enrollment.studentMasterId;
            const entry = entries[s?._id] || {
              pt1Marks: 0,
              mseMarks: 0,
              pt2Marks: 0,
              semMarks: 0
            };

            return (
              <StudentRow 
                key={enrollment._id}
                enrollment={enrollment}
                index={index}
                entry={entry}
                handleInput={handleInput}
              />
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
