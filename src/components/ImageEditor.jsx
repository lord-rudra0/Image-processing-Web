import React, { useState, useCallback } from 'react';
import ImageDropzone from './ImageDropzone';
import FilterPanel from './panels/FilterPanel';
import ToolbarPanel from './panels/ToolbarPanel';
import { filterInfo } from '../constants/filterInfo';
import { Download, RotateCcw } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - Image Area */}
          <div className="lg:col-span-8 space-y-4">
            {/* Top Toolbar */}
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Image Editor
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={resetFilters}
                  disabled={!image}
                  className="btn-secondary"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!image}
                  className="btn-primary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>

            {/* Image Canvas */}
            <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[500px] flex items-center justify-center">
              {image ? (
                <div className="relative w-full h-full group">
                  <img
                    src={image}
                    alt="Preview"
                    className="max-w-full max-h-[600px] mx-auto rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                    style={{ filter: getCSSFilters() }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-lg" />
                </div>
              ) : (
                <ImageDropzone onImageUpload={handleImageUpload} />
              )}
            </div>
          </div>

          {/* Sidebar - Controls */}
          <div className="lg:col-span-4 space-y-4">
            {/* Filter Controls */}
            <FilterPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              filterValues={filterValues}
              handleSliderChange={handleSliderChange}
              filterTabs={filterTabs}
            />

            {/* Selected Filter Info */}
            {selectedFilter && filterInfo[selectedFilter] && (
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {filterInfo[selectedFilter].title}
                  </h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                    {activeTab}
                  </span>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  {filterInfo[selectedFilter].description}
                </p>

                {filterInfo[selectedFilter].usage && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      How to use
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {filterInfo[selectedFilter].usage}
                    </p>
                  </div>
                )}

                {filterInfo[selectedFilter].parameters && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Parameters
                    </h4>
                    <div className="grid gap-2">
                      {Object.entries(filterInfo[selectedFilter].parameters).map(([key, value]) => (
                        <div 
                          key={key}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <span className="text-sm font-medium text-gray-700">{key}</span>
                          <span className="text-sm text-gray-500">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
            <p className="mt-4 text-blue-500 font-medium animate-pulse">
              Processing your image...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor; 