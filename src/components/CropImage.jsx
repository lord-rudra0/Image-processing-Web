import React, { useState } from 'react';

const CropImage = () => {
  const [filename, setFilename] = useState('');
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [right, setRight] = useState(100);
  const [bottom, setBottom] = useState(100);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleCrop = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/crop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, left, top, right, bottom }),
      });

      const data = await response.json();
      if (data.image) {
        setCroppedImage(`data:image/jpeg;base64,${data.image}`);
      } else {
        console.error('Crop failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Crop Image</h2>
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