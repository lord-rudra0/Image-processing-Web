import React, { useState } from 'react';
import { compressImage } from '../api/imageService'; // Import the API function

const CompressImage = () => {
  const [filename, setFilename] = useState('');
  const [quality, setQuality] = useState(85);
  const [compressedImage, setCompressedImage] = useState(null);
  const [error, setError] = useState('');

  const handleCompress = async () => {
    setError(''); // Clear previous errors
    try {
      const data = await compressImage(filename, quality);
      setCompressedImage(`data:image/jpeg;base64,${data.image}`);
    } catch (err) {
      setError(err.message || 'Compression failed');
      console.error('Compression failed:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Compress Image</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        type="text"
        placeholder="Filename"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />
      <input
        type="number"
        placeholder="Quality (0-100)"
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />
      <button onClick={handleCompress} className="bg-blue-500 text-white p-2 rounded">
        Compress
      </button>
      {compressedImage && (
        <img src={compressedImage} alt="Compressed" className="mt-4 max-w-full" />
      )}
    </div>
  );
};

export default CompressImage; 