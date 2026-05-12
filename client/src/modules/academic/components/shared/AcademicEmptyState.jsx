import { FileSearch } from 'lucide-react';

const AcademicEmptyState = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
      <FileSearch className="w-8 h-8" />
    </div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <p className="text-gray-500 max-w-xs mx-auto text-sm mt-1">{description}</p>
  </div>
);

export default AcademicEmptyState;
