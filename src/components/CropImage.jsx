import React, { useState, useCallback } from 'react';
import { cropImage, uploadImage } from '../api/imageService';
import downloadImage from '../utils/download';
import { useDropzone } from 'react-dropzone';

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
  const [imageUploaded, setImageUploaded] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const imageFile = acceptedFiles[0];
    setSelectedImage(URL.createObjectURL(imageFile));

    try {
      setLoading(true);
      const data = await uploadImage(imageFile);
      setFilename(data.filename); // Set the filename from the upload response
      setImageUploaded(true); // Set imageUploaded to true after successful upload
    } catch (err) {
      setError(err.message || 'Image upload failed');
      console.error('Image upload failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*,.png,.jpg,.jpeg,.webp',
    multiple: false,
  });

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

      {!imageUploaded && (
        <div
          {...getRootProps()}
          role="presentation"
          tabIndex={0}
          className="w-full h-96 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-[1.02] border-gray-700 hover:border-blue-500 bg-gray-800/50 hover:bg-gray-800/70"
        >
          <input
            {...getInputProps()}
            accept="image/*,.png,.jpg,.jpeg,.webp"
            type="file"
            tabIndex="-1"
            style={{
              border: '0px',
              clip: 'rect(0px, 0px, 0px, 0px)',
              clipPath: 'inset(50%)',
              height: '1px',
              margin: '0px -1px -1px 0px',
              overflow: 'hidden',
              padding: '0px',
              position: 'absolute',
              width: '1px',
              whiteSpace: 'nowrap',
            }}
          />
          <div className="text-center p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-image w-16 h-16 mx-auto text-gray-400 mb-6"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-200 mb-2">Upload your image</h3>
            <p className="text-gray-400 mb-6">Drag &amp; drop or click to select</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <span>Supports:</span>
              <span className="px-2 py-1 bg-gray-700/50 rounded">.PNG</span>
              <span className="px-2 py-1 bg-gray-700/50 rounded">.JPG</span>
              <span className="px-2 py-1 bg-gray-700/50 rounded">.JPEG</span>
              <span className="px-2 py-1 bg-gray-700/50 rounded">.WebP</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mb-6">
        {selectedImage && (
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">Uploaded Image:</h3>
            <img
              src={selectedImage}
              alt="Uploaded"
              className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
            />
          </div>
        )}

        {croppedImage && (
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">Cropped Image:</h3>
            <img
              src={croppedImage}
              alt="Cropped"
              className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
            />
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
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${
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