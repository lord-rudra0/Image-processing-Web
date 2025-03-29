import React from 'react';
import { Sliders } from 'lucide-react';

const FilterPanel = ({ 
  activeTab, 
  setActiveTab, 
  filterValues, 
  handleSliderChange, 
  filterTabs 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Sliders className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">
          Adjustments
        </h3>
      </div>

      {/* Filter Categories */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(filterTabs).map(([key, tab]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === key 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="space-y-6">
        {filterTabs[activeTab].controls.map((control) => (
          <div key={control.name} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700">
                {control.label}
              </label>
              <span className="text-sm text-gray-500">
                {filterValues[control.name]}{control.unit || '%'}
              </span>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              value={filterValues[control.name]}
              onChange={(e) => handleSliderChange(control.name, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel; 