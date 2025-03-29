import React, { useState } from 'react';
import { resizeImage } from '../api/imageService'; // Import the API function

const ResizeImage = () => {
  const [filename, setFilename] = useState('');
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [resizedImage, setResizedImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResize = async () => {
    setError(''); // Clear previous errors
    setLoading(true);
    try {
      const data = await resizeImage(filename, width, height);
      setResizedImage(`data:image/jpeg;base64,${data.image}`);
    } catch (err) {
      setError(err.message || 'Resize failed');
      console.error('Resize failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Resize Image</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="filename">
          Filename:
        </label>
        <input
          type="text"
          id="filename"
          placeholder="Enter filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="width">
            Width:
          </label>
          <input
            type="number"
            id="width"
            placeholder="Enter width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="height">
            Height:
          </label>
          <input
            type="number"
            id="height"
            placeholder="Enter height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
          />
        </div>
      </div>

      <button
        onClick={handleResize}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Resizing...' : 'Resize'}
      </button>

      {resizedImage && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Resized Image:</h3>
          <img src={resizedImage} alt="Resized" className="max-w-full rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
};

export default ResizeImage; 