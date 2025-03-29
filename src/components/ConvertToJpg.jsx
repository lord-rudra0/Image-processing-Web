import React, { useState } from 'react';

const ConvertToJpg = () => {
  const [filename, setFilename] = useState('');
  const [convertedImage, setConvertedImage] = useState(null);

  const handleConvert = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/convert-to-jpg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      });

      const data = await response.json();
      if (data.image) {
        setConvertedImage(`data:image/jpeg;base64,${data.image}`);
      } else {
        console.error('Conversion failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Convert to JPG</h2>
      <input
        type="text"
        placeholder="Filename"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />
      <button onClick={handleConvert} className="bg-blue-500 text-white p-2 rounded">
        Convert
      </button>
      {convertedImage && (
        <img src={convertedImage} alt="Converted" className="mt-4 max-w-full" />
      )}
    </div>
  );
};

export default ConvertToJpg; 