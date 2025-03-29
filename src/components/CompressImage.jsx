import React, { useState } from 'react';
import { compressImage } from '../api/imageService'; // Import the API function

const CompressImage = () => {
  const [filename, setFilename] = useState('');
  const [quality, setQuality] = useState(85);
  const [compressedImage, setCompressedImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompress = async () => {
    setError(''); // Clear previous errors
    setLoading(true);
    try {
      const data = await compressImage(filename, quality);
      setCompressedImage(`data:image/jpeg;base64,${data.image}`);
    } catch (err) {
      setError(err.message || 'Compression failed');
      console.error('Compression failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Compress Image</h2>
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

      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="quality">
          Quality (1-100):
        </label>
        <input
          type="number"
          id="quality"
          placeholder="Enter quality (1-100)"
          value={quality}
          onChange={(e) => setQuality(Math.max(1, Math.min(100, e.target.value)))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
        />
      </div>

      <button
        onClick={handleCompress}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Compressing...' : 'Compress'}
      </button>

      {compressedImage && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Compressed Image:</h3>
          <img src={compressedImage} alt="Compressed" className="max-w-full rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
};

export default CompressImage; 