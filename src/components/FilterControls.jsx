import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Sliders, RotateCw } from 'lucide-react';

const FilterControls = ({
  categories,
  values,
  onChange,
  onReset
}) => {
  return (
    <div className="bg-gray-800/90 rounded-2xl p-6 border border-gray-700/50 shadow-2xl backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Sliders className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-100">Adjustments</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-700/50 text-gray-200 hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <RotateCw className="w-4 h-4" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div 
            key={category.name}
            className="bg-gray-700/50 rounded-xl p-4 backdrop-blur-sm"
          >
            <h3 className="text-lg font-medium text-gray-200 mb-4">
              {category.name}
            </h3>
            <div className="space-y-4">
              {category.filters.map((filter) => (
                <div 
                  key={filter.name}
                  className="group transition-all duration-300"
                >
                  <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
                    <span>{filter.name}</span>
                    <span className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                      {values[filter.name]}{filter.unit}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={filter.min}
                    max={filter.max}
                    value={values[filter.name]}
                    onChange={(e) => onChange(filter.name, e.target.value)}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-all duration-300 hover:bg-gray-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterControls;