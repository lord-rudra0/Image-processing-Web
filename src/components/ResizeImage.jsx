import React, { useState } from 'react';
import { resizeImage, uploadImage } from '../api/imageService';
import downloadImage from '../utils/download';

const ResizeImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filename, setFilename] = useState('');
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [resizedImage, setResizedImage] = useState(null);
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

  const handleResize = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await resizeImage(filename, width, height);
      setResizedImage(`data:image/jpeg;base64,${data.image}`);
    } catch (err) {
      setError(err.message || 'Resize failed');
      console.error('Resize failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    downloadImage(resizedImage, 'resized_image.jpg');
  };

  return (
    <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Resize Image</h2>
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

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {selectedImage && (
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold mb-2">Uploaded Image:</h3>
            <img src={selectedImage} alt="Uploaded" className="max-w-full rounded-lg shadow-md" />
          </div>
        )}

        {resizedImage && (
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold mb-2">Resized Image:</h3>
            <img src={resizedImage} alt="Resized" className="max-w-full rounded-lg shadow-md" />
            <button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Download Resized Image
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="width">
            Width:
          </label>
          <input
            type="number"
            id="width"
            placeholder="Enter width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="height">
            Height:
          </label>
          <input
            type="number"
            id="height"
            placeholder="Enter height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
          />
        </div>
      </div>

      <button
        onClick={handleResize}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading || !filename}
      >
        {loading ? 'Resizing...' : 'Resize'}
      </button>
    </div>
  );
};

export default ResizeImage; 