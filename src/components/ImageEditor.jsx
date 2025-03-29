import React, { useState, useCallback } from 'react';
import ImageDropzone from './ImageDropzone';
import { Slider, Select, Button } from './ui'; // This should now work
import { filterInfo } from '../constants/filterInfo';
import FilterInfo from './ui/FilterInfo';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out
      ${active 
        ? 'bg-blue-500 text-white shadow-md transform scale-105' 
        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
    `}
  >
    {children}
  </button>
);

const ActionButton = ({ onClick, disabled, variant = 'primary', children }) => {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg active:transform active:scale-95'}
      `}
    >
      {children}
    </button>
  );
};

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [filterValues, setFilterValues] = useState({
    // Basic Filters (CSS Filters)
    brightness: 100,
    contrast: 100,
    saturation: 100,
    opacity: 100,
    blur: 0,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    
    // Advanced Filters (Backend Processing)
    threshold: 127,
    blockSize: 11,
    c: 2,
    sigma: 2.0,
    kernelSize: 5,
    strength: 0.5,
  });
  const [selectedFilter, setSelectedFilter] = useState(null);

  const applyFilter = async (filterType, params) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: image,
          operations: [{
            type: filterType,
            params: params
          }]
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setImage(data.image);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (name, value) => {
    setFilterValues(prev => ({ ...prev, [name]: value }));
  };

  const getCSSFilters = () => {
    return `
      brightness(${filterValues.brightness}%)
      contrast(${filterValues.contrast}%)
      saturate(${filterValues.saturation}%)
      opacity(${filterValues.opacity}%)
      blur(${filterValues.blur}px)
      hue-rotate(${filterValues.hueRotate}deg)
      grayscale(${filterValues.grayscale}%)
      sepia(${filterValues.sepia}%)
      invert(${filterValues.invert}%)
    `;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = image;
    link.click();
  };

  const filterTabs = {
    basic: {
      title: "Basic Filters",
      controls: [
        { name: 'brightness', label: 'Brightness', min: 0, max: 200, default: 100 },
        { name: 'contrast', label: 'Contrast', min: 0, max: 200, default: 100 },
        { name: 'saturation', label: 'Saturation', min: 0, max: 200, default: 100 },
        { name: 'opacity', label: 'Opacity', min: 0, max: 100, default: 100 },
        { name: 'blur', label: 'Blur', min: 0, max: 20, default: 0 },
        { name: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, default: 0 },
        { name: 'grayscale', label: 'Grayscale', min: 0, max: 100, default: 0 },
        { name: 'sepia', label: 'Sepia', min: 0, max: 100, default: 0 },
        { name: 'invert', label: 'Invert', min: 0, max: 100, default: 0 },
      ]
    },
    threshold: {
      title: "Thresholding",
      buttons: [
        { name: 'binary', label: 'Binary', params: { method: 'binary' } },
        { name: 'adaptive', label: 'Adaptive', params: { method: 'adaptive' } },
        { name: 'otsu', label: 'Otsu', params: { method: 'otsu' } },
      ]
    },
    edge: {
      title: "Edge Detection",
      buttons: [
        { name: 'canny', label: 'Canny', params: { method: 'canny' } },
        { name: 'sobel', label: 'Sobel', params: { method: 'sobel' } },
        { name: 'laplace', label: 'Laplace', params: { method: 'laplace' } },
      ]
    },
    noise: {
      title: "Noise Reduction",
      buttons: [
        { name: 'gaussian', label: 'Gaussian', params: { method: 'gaussian' } },
        { name: 'median', label: 'Median', params: { method: 'median' } },
        { name: 'bilateral', label: 'Bilateral', params: { method: 'bilateral' } },
      ]
    },
    morphological: {
      title: "Morphological",
      buttons: [
        { name: 'dilate', label: 'Dilate', params: { operation: 'dilate' } },
        { name: 'erode', label: 'Erode', params: { operation: 'erode' } },
        { name: 'opening', label: 'Opening', params: { operation: 'opening' } },
        { name: 'closing', label: 'Closing', params: { operation: 'closing' } },
      ]
    },
    special: {
      title: "Special Effects",
      buttons: [
        { name: 'cartoon', label: 'Cartoon', params: { effect: 'cartoon' } },
        { name: 'oil_painting', label: 'Oil Painting', params: { effect: 'oil_painting' } },
        { name: 'watercolor', label: 'Watercolor', params: { effect: 'watercolor' } },
        { name: 'pixelate', label: 'Pixelate', params: { effect: 'pixelate' } },
      ]
    }
  };

  const handleImageUpload = useCallback((file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFilterClick = (filterName) => {
    setSelectedFilter(filterName);
  };

  const FilterButton = ({ onClick, disabled, filter, children }) => (
    <button
      onClick={() => {
        handleFilterClick(filter);
        onClick(filter);
      }}
      disabled={disabled}
      className={`
        m-1 px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${disabled 
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600 active:transform active:scale-95'}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Preview Section */}
        <div className="p-6 bg-gray-50">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
            {!image ? (
              <ImageDropzone onImageUpload={handleImageUpload} />
            ) : (
              <img 
                src={image} 
                alt="Edited"
                style={{ filter: getCSSFilters() }}
                className="w-full h-full object-contain"
              />
            )}
          </div>
          
          {/* Image Actions */}
          {image && (
            <div className="mt-4 flex justify-center space-x-4">
              <ActionButton
                variant="danger"
                onClick={() => setImage(null)}
                disabled={loading}
              >
                Reset Image
              </ActionButton>
              <ActionButton
                variant="success"
                onClick={handleDownload}
                disabled={loading}
              >
                Download Image
              </ActionButton>
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(filterTabs).map(([key, tab]) => (
              <TabButton
                key={key}
                active={activeTab === key}
                onClick={() => setActiveTab(key)}
              >
                {tab.title}
              </TabButton>
            ))}
          </div>

          {/* Filter Controls */}
          <div className="space-y-6">
            {activeTab === 'basic' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filterTabs.basic.controls.map(control => (
                  <div key={control.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {control.label}
                    </label>
                    <Slider
                      min={control.min}
                      max={control.max}
                      value={filterValues[control.name]}
                      onChange={(value) => handleSliderChange(control.name, value)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filterTabs[activeTab].buttons.map(button => (
                  <FilterButton
                    key={button.name}
                    onClick={() => {
                      handleFilterClick(button.name);
                      applyFilter(activeTab, button.params);
                    }}
                    disabled={loading}
                    filter={button.name}
                  >
                    {button.label}
                  </FilterButton>
                ))}
              </div>
            )}
          </div>

          {/* Add this section for filter information display */}
          {selectedFilter && filterInfo[selectedFilter] && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filterInfo[selectedFilter].title}
              </h3>
              <p className="text-gray-600 mb-3">
                {filterInfo[selectedFilter].description}
              </p>
              {filterInfo[selectedFilter].usage && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Usage:</h4>
                  <p className="text-gray-600">{filterInfo[selectedFilter].usage}</p>
                </div>
              )}
              {filterInfo[selectedFilter].parameters && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Parameters:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {Object.entries(filterInfo[selectedFilter].parameters).map(([key, value]) => (
                      <li key={key} className="ml-2">
                        <span className="font-medium">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="mt-4 flex items-center justify-center text-blue-500">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </div>
          )}
        </div>
      </div>

      {/* <FilterInfo 
        isOpen={selectedFilter !== null}
        onClose={() => setSelectedFilter(null)}
        filterInfo={selectedFilter && filterInfo[selectedFilter] ? filterInfo[selectedFilter] : null}
      /> */}
    </div>
  );
};

export default ImageEditor; 