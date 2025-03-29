import React, { useState } from 'react';

const CompressImage = () => {
  const [filename, setFilename] = useState('');
  const [quality, setQuality] = useState(85);
  const [compressedImage, setCompressedImage] = useState(null);

  const handleCompress = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/compress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, quality }),
      });

      const data = await response.json();
      if (data.image) {
        setCompressedImage(`data:image/jpeg;base64,${data.image}`);
      } else {
        console.error('Compression failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Compress Image</h2>
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