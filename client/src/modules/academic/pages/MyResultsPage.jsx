import { useState, useEffect } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import { useResults } from '../hooks/useResults';
import { useInternalMarks } from '../hooks/useInternalMarks';
import { Award, Percent, ChevronRight, FileText, Download, Sparkles, BookOpen, ChevronDown, CheckCircle } from 'lucide-react';

const MyResultsPage = () => {
  const { results, loading: loadingResults, fetchResults } = useResults();
  const { marks, loading: loadingMarks, fetchMyMarks } = useInternalMarks();
  const [expandedSubject, setExpandedSubject] = useState(null);

  useEffect(() => {
    fetchResults();
    fetchMyMarks();
  }, [fetchResults, fetchMyMarks]);

  const toggleSubject = (key) => {
    setExpandedSubject(expandedSubject === key ? null : key);
  };

  const handleDownloadGradecard = (result) => {
    const studentName = result.studentId?.personalDetails?.fullName || "Student Name";
    const rollNo = result.studentId?.studentId || "N/A";
    const semName = result.semesterId?.semesterName || "Semester";
    const academicYear = result.academicYearId?.name || "N/A";
    const overallPass = result.subjectResults.every(s => s.status === 'Pass');
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow pop-ups to download your gradecard.");
      return;
    }

    const rowsHtml = result.subjectResults.map((sub, i) => {
      const matched = marks.find(m => m.subjectId?._id === sub.subjectId?._id);
      const pt1 = matched ? matched.pt1Marks : 0;
      const mse = matched ? matched.mseMarks : 0;
      const pt2 = matched ? matched.pt2Marks : 0;
      const sem = matched ? matched.semMarks : 0;
      
      return `
        <tr>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 11px;">${sub.subjectId?.subjectCode || ''}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">${sub.subjectId?.subjectName || ''}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${pt1}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${mse}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${pt2}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${sem}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 800; color: #1e3a8a;">${sub.totalMarks} / ${sub.maxMarks}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 800;">${sub.grade}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: ${sub.status === 'Pass' ? '#10b981' : '#ef4444'}">${sub.status.toUpperCase()}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gradecard - ${studentName} - ${semName}</title>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
          }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 40px;
            background-color: #ffffff;
          }
          .gradecard-container {
            max-width: 800px;
            margin: 0 auto;
            border: 4px double #1e3a8a;
            padding: 40px;
            position: relative;
            background: #fff;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(30, 58, 138, 0.04);
            font-weight: 900;
            white-space: nowrap;
            pointer-events: none;
            user-select: none;
            z-index: 0;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 20px;
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
          }
          .header h1 {
            margin: 0;
            font-size: 26px;
            color: #1e3a8a;
            text-transform: uppercase;
            font-weight: 900;
            letter-spacing: 1px;
          }
          .header p {
            margin: 5px 0 0 0;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 800;
            color: #64748b;
            letter-spacing: 2px;
          }
          .gradecard-title {
            text-align: center;
            font-size: 18px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: 1.5px;
            margin-bottom: 30px;
            text-transform: uppercase;
          }
          .student-info-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 15px;
            margin-bottom: 30px;
            font-size: 13px;
            position: relative;
            z-index: 1;
          }
          .info-item {
            display: flex;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 6px;
          }
          .info-label {
            font-weight: 800;
            color: #64748b;
            width: 140px;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
          }
          .info-value {
            font-weight: bold;
            color: #0f172a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            font-size: 12px;
            position: relative;
            z-index: 1;
          }
          th {
            background-color: #1e3a8a;
            color: #ffffff;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.5px;
            padding: 12px;
            border: 1px solid #1e3a8a;
          }
          .summary-section {
            display: flex;
            justify-content: space-between;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 40px;
            position: relative;
            z-index: 1;
          }
          .summary-item {
            text-align: center;
          }
          .summary-label {
            font-size: 10px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
          }
          .summary-value {
            font-size: 18px;
            font-weight: 900;
            color: #1e3a8a;
          }
          .footer-signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            font-size: 12px;
            position: relative;
            z-index: 1;
          }
          .sig-box {
            text-align: center;
            width: 200px;
          }
          .sig-line {
            border-top: 1px solid #94a3b8;
            margin-top: 50px;
            padding-top: 8px;
            font-weight: 800;
            color: #475569;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.5px;
          }
          .actions {
            max-width: 800px;
            margin: 20px auto 0 auto;
            text-align: right;
          }
          .btn-print {
            background-color: #1e3a8a;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.2);
            transition: all 0.2s;
          }
          .btn-print:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="gradecard-container">
          <div class="watermark">ERPSAA ACADEMIC</div>
          <div class="header">
            <h1>ERPSAA Institute of Technology</h1>
            <p>Autonomous Institution under BY-TECH group &bull; Academic Grade Division</p>
          </div>
          
          <div class="gradecard-title">Official Semester Grade Report</div>
          
          <div class="student-info-grid">
            <div class="info-item">
              <span class="info-label">Student Name:</span>
              <span class="info-value">${studentName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Roll Number:</span>
              <span class="info-value">${rollNo}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Semester:</span>
              <span class="info-value">${semName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Academic Year:</span>
              <span class="info-value">${academicYear}</span>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 100px;">Subject Code</th>
                <th>Subject Name</th>
                <th style="width: 50px; text-align: center;">PT1 (20)</th>
                <th style="width: 50px; text-align: center;">MSE (20)</th>
                <th style="width: 50px; text-align: center;">PT2 (20)</th>
                <th style="width: 50px; text-align: center;">SEM (60)</th>
                <th style="width: 80px; text-align: center;">Total (120)</th>
                <th style="width: 50px; text-align: center;">Grade</th>
                <th style="width: 70px; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          
          <div class="summary-section">
            <div class="summary-item">
              <div class="summary-label">Grand Total</div>
              <div class="summary-value" style="color: #0f172a;">${result.grandTotal} / ${result.maxTotal}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Percentage</div>
              <div class="summary-value">${result.percentage.toFixed(2)}%</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Overall Grade</div>
              <div class="summary-value" style="color: #1e3a8a; font-size: 22px;">${result.overallGrade}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Result Status</div>
              <div class="summary-value" style="color: ${overallPass ? '#10b981' : '#ef4444'};">${overallPass ? 'PASSED' : 'FAILED'}</div>
            </div>
          </div>
          
          <div class="footer-signatures">
            <div class="sig-box">
              <div class="sig-line">Prepared & Verified By</div>
            </div>
            <div class="sig-box">
              <div class="sig-line">Controller of Examinations</div>
            </div>
          </div>
        </div>
        
        <div class="actions no-print" style="margin-top: 20px;">
          <button type="button" class="btn-print" onclick="window.print()">Print / Save as PDF</button>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const loading = loadingResults || loadingMarks;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-4">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">Compiling semester results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AcademicPageHeader
        title="My Semester Results"
        subtitle="Official grade reports and academic progress track sheets"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {results.length > 0 ? results.map((result) => {
          const overallPass = result.subjectResults.every(s => s.status === 'Pass');

          return (
            <div key={result._id} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-300 group">
              {/* Header */}
              <div className="p-8 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">{result.semesterId?.semesterName || 'Semester'}</h3>
                  <p className="text-[10px] font-black text-gray-400 mt-0.5 uppercase tracking-widest">{result.academicYearId?.name}</p>
                </div>
                <div className="w-14 h-14 bg-brand-dark text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-brand-dark/20 group-hover:scale-105 transition-transform duration-300">
                  {result.overallGrade}
                </div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100/50">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Percentage</p>
                    <div className="flex items-center gap-1.5 text-xl font-black text-primary-600">
                      <Percent className="w-4 h-4" />
                      {result.percentage.toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100/50 text-center flex flex-col justify-center items-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Pass Status</p>
                    <div className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mt-1 ${
                      overallPass ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {overallPass ? 'PASSED' : 'FAIL'}
                    </div>
                  </div>
                </div>

                {/* Subject Results */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject Performance</p>
                  {result.subjectResults.map((sub, i) => {
                    const uniqueKey = `${result._id}-${sub.subjectId?._id}`;
                    const isExpanded = expandedSubject === uniqueKey;
                    
                    // Match with internal marks records
                    const matchedMarks = marks.find(m => m.subjectId?._id === sub.subjectId?._id);

                    return (
                      <div key={i} className="border border-gray-100 rounded-3xl overflow-hidden bg-white hover:border-primary-200 transition-all duration-300">
                        {/* Summary Row */}
                        <div 
                          onClick={() => toggleSubject(uniqueKey)}
                          className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                            <div>
                              <span className="text-xs font-bold text-gray-800 line-clamp-1">{sub.subjectId?.subjectName || 'Subject'}</span>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{sub.subjectId?.subjectCode}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              sub.status === 'Pass' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {sub.grade}
                            </span>
                            <span className="text-xs font-black text-primary-600">{sub.totalMarks}/{sub.maxMarks}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary-600' : ''}`} />
                          </div>
                        </div>

                        {/* Expandable breakdown */}
                        {isExpanded && (
                          <div className="bg-gray-50 p-5 border-t border-gray-100 animate-in slide-in-from-top duration-300 space-y-4">
                            {matchedMarks ? (
                              <>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Exam Breakdown</p>
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  <div className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between">
                                    <span className="font-bold text-gray-500">PT1:</span>
                                    <span className="font-black text-gray-900">{matchedMarks.pt1Marks} / 20</span>
                                  </div>
                                  <div className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between">
                                    <span className="font-bold text-gray-500">MSE:</span>
                                    <span className="font-black text-gray-900">{matchedMarks.mseMarks} / 20</span>
                                  </div>
                                  <div className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between">
                                    <span className="font-bold text-gray-500">PT2:</span>
                                    <span className="font-black text-gray-900">{matchedMarks.pt2Marks} / 20</span>
                                  </div>
                                  <div className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between col-span-2">
                                    <span className="font-bold text-gray-500">Semester Exam (SEM):</span>
                                    <span className="font-black text-primary-600">{matchedMarks.semMarks} / 60</span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <p className="text-[10px] font-bold text-gray-400 italic text-center py-2">
                                Detailed exam parameters not accessible.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <button type="button" 
                onClick={() => handleDownloadGradecard(result)}
                className="w-full py-6 bg-gray-50 hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 border-t border-gray-100"
              >
                <Download className="w-4 h-4" /> Download Digital Gradecard
              </button>
            </div>
          );
        }) : (
          <div className="col-span-full p-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-gray-400 text-sm font-black uppercase tracking-wider animate-pulse flex flex-col items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-gray-300" />
            Your academic performance results have not been published yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResultsPage;
