import React, { useState, useCallback } from 'react';
import { DribbbleIcon, GithubIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Slider } from './ui';
import { filterCategories } from '../constants';

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterValues, setFilterValues] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    opacity: 100,
    blur: 0,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
  });

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

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">I❤IMG</h1>
          <nav>
            <a href="#" className="mr-4 hover:text-gray-300">
              Compress
            </a>
            <a href="#" className="mr-4 hover:text-gray-300">
              Resize
            </a>
            <a href="#" className="mr-4 hover:text-gray-300">
              Crop
            </a>
            <a href="#" className="hover:text-gray-300">
              Convert to JPG
            </a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Preview */}
          <div className="bg-gray-700 rounded-lg shadow-md p-4">
            {image ? (
              <img
                src={image}
                alt="Uploaded"
                className="w-full h-auto rounded-lg"
                style={{ filter: getCSSFilters() }}
              />
            ) : (
              <div
                {...getRootProps()}
                className="dropzone w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-gray-300">Drop the image here...</p>
                ) : (
                  <p className="text-gray-300">Drag 'n' drop an image here, or click to select one</p>
                )}
              </div>
            )}
          </div>

          {/* Filter Controls */}
          <div className="bg-gray-700 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Filter Controls</h2>
            {filterCategories.map(category => (
              <div key={category.name} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                {category.filters.map(filter => (
                  <div key={filter.name} className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor={filter.name}>
                      {filter.name}
                    </label>
                    <Slider
                      min={filter.min}
                      max={filter.max}
                      value={filterValues[filter.name]}
                      onChange={value => handleSliderChange(filter.name, value)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} I❤IMG. All rights reserved.</p>
          <div className="flex items-center">
            <a href="#" className="mr-4 hover:text-gray-300">
              <DribbbleIcon size={20} />
            </a>
            <a href="#" className="hover:text-gray-300">
              <GithubIcon size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ImageEditor; 