import React, { useState } from 'react';
import { cropImage } from '../api/imageService'; // Import the API function

const CropImage = () => {
  const [filename, setFilename] = useState('');
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [right, setRight] = useState(100);
  const [bottom, setBottom] = useState(100);
  const [croppedImage, setCroppedImage] = useState(null);
  const [error, setError] = useState('');

  const handleCrop = async () => {
    setError(''); // Clear previous errors
    try {
      const data = await cropImage(filename, left, top, right, bottom);
      setCroppedImage(`data:image/jpeg;base64,${data.image}`);
    } catch (err) {
      setError(err.message || 'Crop failed');
      console.error('Crop failed:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Crop Image</h2>
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
        placeholder="Left"
        value={left}
        onChange={(e) => setLeft(e.target.value)}
        className="border rounded p-2 mb-2 w-1/2"
      />
      <input
        type="number"
        placeholder="Top"
        value={top}
        onChange={(e) => setTop(e.target.value)}
        className="border rounded p-2 mb-2 w-1/2"
      />
      <input
        type="number"
        placeholder="Right"
        value={right}
        onChange={(e) => setRight(e.target.value)}
        className="border rounded p-2 mb-2 w-1/2"
      />
      <input
        type="number"
        placeholder="Bottom"
        value={bottom}
        onChange={(e) => setBottom(e.target.value)}
        className="border rounded p-2 mb-2 w-1/2"
      />
      <button onClick={handleCrop} className="bg-blue-500 text-white p-2 rounded">
        Crop
      </button>
      {croppedImage && (
        <img src={croppedImage} alt="Cropped" className="mt-4 max-w-full" />
      )}
    </div>
  );
};

export default CropImage; 