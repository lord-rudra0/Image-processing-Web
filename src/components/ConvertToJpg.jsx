import React, { useState } from 'react';
import { convertToJpg } from '../api/imageService'; // Import the API function

const ConvertToJpg = () => {
  const [filename, setFilename] = useState('');
  const [convertedImage, setConvertedImage] = useState(null);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    setError(''); // Clear previous errors
    try {
      const data = await convertToJpg(filename);
      setConvertedImage(`data:image/jpeg;base64,${data.image}`);
    } catch (err) {
      setError(err.message || 'Conversion failed');
      console.error('Conversion failed:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Convert to JPG</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
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