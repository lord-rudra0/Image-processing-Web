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
  const [originalImage, setOriginalImage] = useState(null);

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
      const imageData = reader.result;
      setImage(imageData);
      setOriginalImage(imageData);
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

  const resetFilters = () => {
    setFilterValues({
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
    
    setSelectedFilter(null);
    
    if (image) {
      if (originalImage) {
        setImage(originalImage);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Image Preview Section */}
        <div className="space-y-6">
          {image ? (
            <div className="relative group">
              <img
                src={image}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02] border-2 border-white/20"
                style={{ filter: getCSSFilters() }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg" />
            </div>
          ) : (
            <ImageDropzone
              onImageUpload={handleImageUpload}
              className="transform transition-all duration-300 hover:scale-[1.02]"
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={resetFilters}
              disabled={!image}
              className={`
                flex items-center px-4 py-2 rounded-lg font-medium
                transition-all duration-300 transform
                ${!image 
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:scale-105 active:scale-95 shadow-sm'
                }
              `}
            >
              <svg 
                className="w-4 h-4 mr-2 transition-transform duration-300 hover:rotate-180" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
            
            <button
              onClick={handleDownload}
              disabled={!image}
              className={`
                flex items-center px-4 py-2 rounded-lg font-medium
                transition-all duration-300 transform
                ${!image 
                  ? 'opacity-50 cursor-not-allowed bg-blue-100 text-blue-400'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 hover:scale-105 active:scale-95 shadow-sm'
                }
              `}
              >
              <svg 
                className="w-4 h-4 mr-2 animate-bounce" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        </div>

        {/* Controls Section */}
        <div className="space-y-6">
          {/* Filter Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.keys(filterTabs).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 rounded-lg font-medium whitespace-nowrap
                  transition-all duration-300 transform
                  ${activeTab === tab
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white scale-105 shadow-sm'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:scale-105 shadow-sm'
                  }
                `}
              >
                {filterTabs[tab].title}
              </button>
            ))}
          </div>

          {/* Filter Controls */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 transition-all duration-300 hover:shadow-md border border-white/20">
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

          {/* Filter Information */}
          {selectedFilter && filterInfo[selectedFilter] && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 transition-all duration-300 hover:shadow-md animate-fadeIn border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {filterInfo[selectedFilter].title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {filterInfo[selectedFilter].description}
              </p>
              {filterInfo[selectedFilter].usage && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Usage:</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {filterInfo[selectedFilter].usage}
                  </p>
                </div>
              )}
              {filterInfo[selectedFilter].parameters && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Parameters:</h4>
                  <ul className="space-y-2">
                    {Object.entries(filterInfo[selectedFilter].parameters).map(([key, value]) => (
                      <li 
                        key={key}
                        className="flex items-center text-gray-600 bg-white/50 rounded-lg p-3 transition-all duration-300 hover:shadow-sm backdrop-blur-sm"
                      >
                        <span className="font-medium mr-2">{key}:</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/75 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-blue-500 font-medium animate-pulse">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor; 