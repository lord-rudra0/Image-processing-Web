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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">Adjustments</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          <span>Reset Filters</span>
        </button>
      </div>

      <Tabs className="mt-4">
        <TabList className="flex space-x-2 mb-6 border-b border-gray-200">
          {categories.map((category) => (
            <Tab
              key={category.name}
              className="px-4 py-2 text-sm text-gray-600 cursor-pointer border-b-2 border-transparent hover:text-blue-500 hover:border-blue-500 transition-colors"
              selectedClassName="text-blue-500 border-blue-500"
            >
              {category.name}
            </Tab>
          ))}
        </TabList>

        {categories.map((category) => (
          <TabPanel key={category.name}>
            <div className="space-y-6">
              {category.filters.map((filter) => (
                <div key={filter.name} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 group-hover:text-blue-500 transition-colors">
                      {filter.name}
                    </label>
                    <span className="text-sm text-gray-500">
                      {values[filter.name]}{filter.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={filter.min}
                    max={filter.max}
                    value={values[filter.name]}
                    onChange={(e) => onChange(filter.name, Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                      hover:bg-blue-100 transition-colors"
                  />
                </div>
              ))}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default FilterControls;