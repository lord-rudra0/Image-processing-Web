import React, { useState } from 'react';
import { compressImage, uploadImage } from '../api/imageService';
import downloadImage from '../utils/download';

const CompressImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filename, setFilename] = useState('');
  const [quality, setQuality] = useState(85);
  const [compressedImage, setCompressedImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(URL.createObjectURL(imageFile));

    try {
      setLoading(true);
      const data = await uploadImage(imageFile);
      setFilename(data.filename); // Set the filename from the upload response
    } catch (err) {
      setError(err.message || 'Image upload failed');
      console.error('Image upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompress = async () => {
    setError('');
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

  const handleDownload = () => {
    downloadImage(compressedImage, 'compressed_image.jpg');
  };

  return (
    <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Compress Image</h2>
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

        {compressedImage && (
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">Compressed Image:</h3>
            <img src={compressedImage} alt="Compressed" className="max-w-full rounded-lg shadow-md" />
            <button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Download Compressed Image
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
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
        disabled={loading || !filename}
      >
        {loading ? 'Compressing...' : 'Compress'}
      </button>
    </div>
  );
};

export default CompressImage; 