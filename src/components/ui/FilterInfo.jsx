import React from 'react';

const FilterInfo = ({ isOpen, onClose, filterInfo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{filterInfo.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="prose prose-sm">
          <p className="text-gray-600 mb-4">{filterInfo.description}</p>
          {filterInfo.usage && (
            <>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Usage:</h4>
              <p className="text-gray-600 mb-4">{filterInfo.usage}</p>
            </>
          )}
          {filterInfo.parameters && (
            <>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Parameters:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {Object.entries(filterInfo.parameters).map(([key, value]) => (
                  <li key={key} className="mb-1">
                    <span className="font-medium">{key}:</span> {value}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterInfo; 