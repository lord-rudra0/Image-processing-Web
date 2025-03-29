import React, { useState, useCallback } from 'react';
import { convertToJpg, uploadImage } from '../api/imageService'; // Import the API function
import downloadImage from '../utils/download';
import { useDropzone } from 'react-dropzone';

const ConvertToJpg = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filename, setFilename] = useState('');
  const [convertedImage, setConvertedImage] = useState(null);
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

  const handleConvert = async () => {
    setError('');
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

  return (
    <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Convert to JPG</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="flex">
        <div className="w-1/2">
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

          <div className="flex flex-col items-center">
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

            {convertedImage && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Converted Image:</h3>
                <img
                  src={convertedImage}
                  alt="Converted"
                  className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
                />
                <button
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                >
                  Download Converted Image
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 p-4">
          <button
            onClick={handleConvert}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading || !filename}
          >
            {loading ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvertToJpg; 
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

        {convertedImage && (
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">Converted Image:</h3>
            <img
              src={convertedImage}
              alt="Converted"
              className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
            />
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
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${
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