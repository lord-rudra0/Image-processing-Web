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

  const onDrop = useCallback(async (acceptedFiles) => {
    const imageFile = acceptedFiles[0];
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
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

      <div
        {...getRootProps()}
        className={`mb-4 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
          isDragActive ? 'border-blue-500 bg-gray-700' : 'border-gray-500 bg-gray-900'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-400">
          {isDragActive ? 'Drop the image here...' : 'Drag and drop an image here, or click to select one'}
        </p>
      </div>

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