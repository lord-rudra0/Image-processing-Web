import React, { useState } from 'react';

const ResizeImage = () => {
  const [filename, setFilename] = useState('');
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [resizedImage, setResizedImage] = useState(null);

  const handleResize = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, width, height }),
      });

      const data = await response.json();
      if (data.image) {
        setResizedImage(`data:image/jpeg;base64,${data.image}`);
      } else {
        console.error('Resize failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Resize Image</h2>
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