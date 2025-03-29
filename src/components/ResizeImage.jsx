import React, { useState, useCallback } from 'react';
import { resizeImage, uploadImage } from '../api/imageService';
import downloadImage from '../utils/download';
import { useDropzone } from 'react-dropzone';

const ResizeImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filename, setFilename] = useState('');
  const [resizeOption, setResizeOption] = useState('dimensions'); // dimensions, percent, resolution
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [percent, setPercent] = useState(100);
  const [dpi, setDpi] = useState(72);
  const [format, setFormat] = useState('jpeg');
  const [quality, setQuality] = useState(90);
  const [resizedImage, setResizedImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showImage, setShowImage] = useState(false); // New state for toggling image visibility

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

  const handleResize = async () => {
    setError('');
    setLoading(true);
    try {
      let data;
      if (resizeOption === 'dimensions') {
        data = await resizeImage(filename, width, height, format, quality);
      } else if (resizeOption === 'percent') {
        data = await resizeImage(filename, percent, null, format, quality, 'percent');
      } else if (resizeOption === 'resolution') {
        data = await resizeImage(filename, width, height, format, quality, 'resolution', dpi);
      }

      if (data && data.success) {
        setResizedImage(`data:image/jpeg;base64,${data.img}`);
      } else {
        setError(data.error || 'Resize failed');
        console.error('Resize failed:', data.error);
      }
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

      <div className="flex">
        <div className="w-1/2 flex flex-col items-center">
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

          {selectedImage && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Uploaded Image:</h3>
              <img
                src={selectedImage}
                alt="Uploaded"
                className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
              />
            </div>
          )}

          {showImage && resizedImage && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Resized Image:</h3>
              <img
                src={resizedImage}
                alt="Resized"
                className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
              />
            </div>
          )}
        </div>

        <div className="w-1/2 p-4 flex flex-col justify-start">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Resize Option:
            </label>
            <select
              value={resizeOption}
              onChange={(e) => setResizeOption(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            >
              <option value="dimensions">Dimensions</option>
              <option value="percent">Percent</option>
              <option value="resolution">Resolution</option>
            </select>
          </div>

          {resizeOption === 'dimensions' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Width:
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Height:
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                />
              </div>
            </>
          )}

          {resizeOption === 'percent' && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Percent:
              </label>
              <input
                type="number"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              />
            </div>
          )}

          {resizeOption === 'resolution' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Width:
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Height:
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  DPI:
                </label>
                <input
                  type="number"
                  value={dpi}
                  onChange={(e) => setDpi(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Format:
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Quality (1-100):
            </label>
            <input
              type="number"
              value={quality}
              onChange={(e) => setQuality(Math.max(1, Math.min(100, e.target.value)))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleResize}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading || !filename}
            >
              {loading ? 'Resizing...' : 'Resize'}
            </button>
            {resizedImage && (
              <button
                onClick={handleDownload}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
              >
                Download
              </button>
            )}
          </div>

          <label className="inline-flex items-center mt-3">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={showImage}
              onChange={() => setShowImage(!showImage)}
            />
            <span className="ml-2 text-gray-300">Show Resized Image</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ResizeImage; 