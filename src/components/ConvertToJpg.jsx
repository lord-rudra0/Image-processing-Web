import React, { useState } from 'react';
import { convertToJpg, uploadImage } from '../api/imageService'; // Import the API function
import downloadImage from '../utils/download';

const ConvertToJpg = () => {
  const [filename, setFilename] = useState('');
  const [convertedImage, setConvertedImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleConvert = async () => {
    setError(''); // Clear previous errors
    setLoading(true);
    try {
      const data = await convertToJpg(filename);
      setConvertedImage(`data:image/jpeg;base64,${data.image}`);
    } catch (err) {
      setError(err.message || 'Conversion failed');
      console.error('Conversion failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    downloadImage(convertedImage, 'converted_image.jpg');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Convert to JPG</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="image">
          Upload Image:
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
        />
      </div>

      <div className="flex justify-center gap-4 mb-6">
        {selectedImage && (
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">Uploaded Image:</h3>
            <img src={selectedImage} alt="Uploaded" className="max-w-full rounded-lg shadow-md" />
          </div>
        )}

        {convertedImage && (
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">Converted Image:</h3>
            <img src={convertedImage} alt="Converted" className="max-w-full rounded-lg shadow-md" />
            <button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Download Converted Image
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleConvert}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading || !filename}
      >
        {loading ? 'Converting...' : 'Convert'}
      </button>
    </div>
  );
};

export default ConvertToJpg; 