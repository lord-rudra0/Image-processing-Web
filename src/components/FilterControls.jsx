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
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-blue-500 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-800">Adjustments</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <RotateCw className="w-4 h-4 transition-transform duration-300 hover:rotate-180" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div 
            key={category.name}
            className="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md"
          >
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              {category.name}
            </h3>
            <div className="space-y-4">
              {category.filters.map((filter) => (
                <div 
                  key={filter.name}
                  className="group transition-all duration-300"
                >
                  <label className="flex items-center justify-between text-sm font-medium text-gray-600 mb-2">
                    <span>{filter.name}</span>
                    <span className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                      {values[filter.name]}{filter.unit}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={filter.min}
                    max={filter.max}
                    value={values[filter.name]}
                    onChange={(e) => onChange(filter.name, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-all duration-300 hover:bg-gray-300"
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