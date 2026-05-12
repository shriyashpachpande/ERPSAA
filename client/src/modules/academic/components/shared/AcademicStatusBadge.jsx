const AcademicStatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    upcoming: 'bg-blue-50 text-blue-600 border-blue-100',
    completed: 'bg-gray-50 text-gray-600 border-gray-100',
    dropped: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles.completed}`}>
      {status?.toUpperCase() || 'ACTIVE'}
    </span>
  );
};

export default AcademicStatusBadge;
