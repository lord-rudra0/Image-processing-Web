import React, { useState } from 'react';
import { cropImage, uploadImage } from '../api/imageService';
import downloadImage from '../utils/download';

const CropImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filename, setFilename] = useState('');
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [right, setRight] = useState(100);
  const [bottom, setBottom] = useState(100);
  const [croppedImage, setCroppedImage] = useState(null);
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

  const handleCrop = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await cropImage(filename, left, top, right, bottom);
      setCroppedImage(`data:image/jpeg;base64,${data.image}`);
    } catch (err) {
      setError(err.message || 'Crop failed');
      console.error('Crop failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    downloadImage(croppedImage, 'cropped_image.jpg');
  };

  return (
    <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Crop Image</h2>
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

        {croppedImage && (
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold mb-2">Cropped Image:</h3>
            <img src={croppedImage} alt="Cropped" className="max-w-full rounded-lg shadow-md" />
            <button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Download Cropped Image
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="left">
            Left:
          </label>
          <input
            type="number"
            id="left"
            placeholder="Left coordinate"
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="top">
            Top:
          </label>
          <input
            type="number"
            id="top"
            placeholder="Top coordinate"
            value={top}
            onChange={(e) => setTop(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="right">
            Right:
          </label>
          <input
            type="number"
            id="right"
            placeholder="Right coordinate"
            value={right}
            onChange={(e) => setRight(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="bottom">
            Bottom:
          </label>
          <input
            type="number"
            id="bottom"
            placeholder="Bottom coordinate"
            value={bottom}
            onChange={(e) => setBottom(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
          />
        </div>
      </div>

      <button
        onClick={handleCrop}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading || !filename}
      >
        {loading ? 'Cropping...' : 'Crop'}
      </button>
    </div>
  );
};

export default CropImage; 