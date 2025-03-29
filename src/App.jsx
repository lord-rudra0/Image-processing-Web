import React, { useState, useCallback, useMemo } from 'react';
import { Download, Wand2 } from 'lucide-react';
import ImageDropzone from './components/ImageDropzone';
import FilterControls from './components/FilterControls';
import { filterCategories } from './constants';

function App() {
  const [image, setImage] = useState(null);
  const [filterValues, setFilterValues] = useState(() => {
    return filterCategories.reduce((acc, category) => {
      category.filters.forEach(filter => {
        acc[filter.name] = filter.default;
      });
      return acc;
    }, {});
  });

  const handleImageUpload = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFilterChange = async (filter, value) => {
    if (filter.cssProperty) {
      // Handle CSS filters directly in the browser
      setFilterValues(prev => ({ ...prev, [filter.cssProperty]: value }));
    } else {
      // Send to backend for processing
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: image,
          operations: [{
            type: filter.name.toLowerCase(),
            params: { value }
          }]
        })
      });
      const result = await response.json();
      setImage(result.image);
    }
  };

  const handleReset = useCallback(() => {
    setFilterValues(
      filterCategories.reduce((acc, category) => {
        category.filters.forEach(filter => {
          acc[filter.name] = filter.default;
        });
        return acc;
      }, {})
    );
  }, []);

  const imageStyle = useMemo(() => {
    const style = { filter: '', transform: '' };
    
    filterCategories.forEach(category => {
      category.filters.forEach(filter => {
        if (filter.transform) {
          if (filter.name === 'Scale') {
            style.transform += `scale(${filterValues[filter.name] / 100}) `;
          } else if (filter.name === 'Rotate') {
            style.transform += `rotate(${filterValues[filter.name]}deg) `;
          }
        } else if (filter.cssProperty) {
          style.filter += `${filter.cssProperty}(${filterValues[filter.name]}${filter.unit}) `;
        }
      });
    });
    
    return style;
  }, [filterValues]);

  const handleDownload = useCallback(() => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.filter = imageStyle.filter;
        
        // Handle transforms
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        ctx.translate(centerX, centerY);
        const scale = filterValues['Scale'] / 100;
        ctx.scale(scale, scale);
        ctx.rotate((filterValues['Rotate'] * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
        
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    
    img.src = image;
  }, [image, imageStyle, filterValues]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Wand2 className="w-8 h-8 text-blue-500" />
          <h1 className="text-4xl font-bold text-gray-900">
            Image Processing Studio
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {!image ? (
              <ImageDropzone onImageUpload={handleImageUpload} />
            ) : (
              <div className="relative group bg-white p-4 rounded-xl shadow-lg">
                <img
                  src={image}
                  alt="Uploaded image"
                  className="w-full rounded-lg transition-transform duration-300"
                  style={imageStyle}
                />
                <button
                  onClick={handleDownload}
                  className="absolute bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full p-4 transition-all transform hover:scale-110 flex items-center space-x-2"
                  title="Download edited image"
                >
                  <Download className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <FilterControls
              categories={filterCategories}
              values={filterValues}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;