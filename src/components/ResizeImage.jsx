import React, { useState } from 'react';
import { resizeImage } from '../api/imageService'; // Import the API function

const ResizeImage = () => {
  const [filename, setFilename] = useState('');
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [resizedImage, setResizedImage] = useState(null);
  const [error, setError] = useState('');

  const handleResize = async () => {
    setError(''); // Clear previous errors
    try {
      const data = await resizeImage(filename, width, height);
      setResizedImage(`data:image/jpeg;base64,${data.image}`);
    } catch (err) {
      setError(err.message || 'Resize failed');
      console.error('Resize failed:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Resize Image</h2>
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
        placeholder="Width"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />
      <input
        type="number"
        placeholder="Height"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />
      <button onClick={handleResize} className="bg-blue-500 text-white p-2 rounded">
        Resize
      </button>
      {resizedImage && (
        <img src={resizedImage} alt="Resized" className="mt-4 max-w-full" />
      )}
    </div>
  );
};

export default ResizeImage; 