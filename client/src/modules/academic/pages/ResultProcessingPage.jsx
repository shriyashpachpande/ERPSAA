import { useState } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import ResultGenerationForm from '../components/results/ResultGenerationForm';
import ResultsTable from '../components/results/ResultsTable';
import { useResults } from '../hooks/useResults';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { Settings, FileText, Globe } from 'lucide-react';

const ResultProcessingPage = () => {
  const { years } = useAcademicYears();
  const { results, loading, fetchResults, generate, publish } = useResults();
  const [filters, setFilters] = useState({
    academicYearId: '',
    semesterId: '',
    sectionId: ''
  });

  const handleGenerate = async (data) => {
    await generate(data);
    setFilters(data);
    fetchResults(data);
  };

  const handlePublish = async () => {
    if (window.confirm('Are you sure you want to publish these results? Students will be able to see them immediately.')) {
      await publish(filters);
      fetchResults(filters);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AcademicPageHeader 
        title="Result Processing" 
        subtitle="Generate and publish academic performance reports" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ResultGenerationForm 
            years={years} 
            onGenerate={handleGenerate} 
            loading={loading}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
               <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                 <FileText className="w-5 h-5 text-primary-500" /> Preview Results
               </h3>
               {results.length > 0 && results.some(r => r.resultStatus !== 'Published') && (
                 <button 
                  onClick={handlePublish}
                  className="px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all flex items-center gap-2"
                 >
                   <Globe className="w-4 h-4" /> Publish All
                 </button>
               )}
            </div>
            <ResultsTable data={results} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultProcessingPage;
