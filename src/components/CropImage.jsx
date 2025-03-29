import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cropImage, uploadImage } from '../api/imageService';
import downloadImage from '../utils/download';
import { useDropzone } from 'react-dropzone';

const CropImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filename, setFilename] = useState('');
  const [cropWidth, setCropWidth] = useState(100);
  const [cropHeight, setCropHeight] = useState(100);
  const [aspectRatio, setAspectRatio] = useState('FreeForm');
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [croppedImage, setCroppedImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const imageRef = useRef(null);

  const aspectRatioOptions = {
    FreeForm: null,
    Original: null,
    Custom: null,
    '1:1': 1,
    '4:3': 4 / 3,
    '3:2': 3 / 2,
    '5:4': 5 / 4,
    '16:9': 16 / 9,
    '9:16': 9 / 16,
    '2:3': 2 / 3,
    '1.91:1': 1.91,
    '4:5': 4 / 5,
    '2:1': 2,
    '21:9': 21 / 9,
    '2.35:1': 2.35,
    '1.85:1': 1.85,
    '3:4': 3 / 4,
    '1080x1080': 1,
    '400x400': 1,
    '1280x720': 1280 / 720,
    '1920x1080': 1920 / 1080,
    '2048x1152': 2048 / 1152,
    '851x315': 851 / 315,
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const imageFile = acceptedFiles[0];
    setSelectedImage(URL.createObjectURL(imageFile));

    try {
      setLoading(true);
      const data = await uploadImage(imageFile);
      setFilename(data.filename);
      setImageUploaded(true);
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

  useEffect(() => {
    if (aspectRatio !== 'FreeForm' && aspectRatio !== 'Custom' && aspectRatio !== 'Original') {
      const ratio = aspectRatioOptions[aspectRatio];
      if (ratio) {
        setCropHeight(Math.round(cropWidth / ratio));
      }
    }
  }, [aspectRatio, cropWidth]);

  const handleCrop = async () => {
    setError('');
    setLoading(true);
    try {
      let calculatedWidth = cropWidth;
      let calculatedHeight = cropHeight;

      if (aspectRatio === 'Original' && imageRef.current) {
        calculatedWidth = imageRef.current.naturalWidth;
        calculatedHeight = imageRef.current.naturalHeight;
      }

      const data = await cropImage(filename, positionX, positionY, positionX + calculatedWidth, positionY + calculatedHeight);
      if (data && data.success) {
        setCroppedImage(`data:image/jpeg;base64,${data.img}`);
      } else {
        setError(data.error || 'Crop failed');
      }
    } catch (err) {
      setError(err.message || 'Crop failed');
      console.error('Crop failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    downloadImage(croppedImage, `cropped_image_${aspectRatio}.jpg`);
  };

  return (
    <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Crop Image</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="flex">
        <div className="w-1/2 flex flex-col items-center">
          {!imageUploaded ? (
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
                {isDragActive ? (
                  <p className="text-blue-400">Drop your image here</p>
                ) : (
                  <>
                    <p className="text-gray-400">Drag & drop or click to select</p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                      <span>Supports:</span>
                      <span className="px-2 py-1 bg-gray-700/50 rounded">.PNG</span>
                      <span className="px-2 py-1 bg-gray-700/50 rounded">.JPG</span>
                      <span className="px-2 py-1 bg-gray-700/50 rounded">.JPEG</span>
                      <span className="px-2 py-1 bg-gray-700/50 rounded">.WebP</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            selectedImage && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Uploaded Image:</h3>
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
                  ref={imageRef}
                />
              </div>
            )
          )}

          {showImage && croppedImage && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Cropped Image:</h3>
              <img
                src={croppedImage}
                alt="Cropped"
                className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
              />
            </div>
          )}
        </div>

        <div className="w-1/2 p-4 flex flex-col justify-start">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Aspect Ratio:
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            >
              {Object.keys(aspectRatioOptions).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {(aspectRatio === 'FreeForm' || aspectRatio === 'Custom') && (
            <>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Crop Width:
                </label>
                <input
                  type="number"
                  value={cropWidth}
                  onChange={(e) => setCropWidth(parseInt(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Crop Height:
                </label>
                <input
                  type="number"
                  value={cropHeight}
                  onChange={(e) => setCropHeight(parseInt(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Position X:
            </label>
            <input
              type="number"
              value={positionX}
              onChange={(e) => setPositionX(parseInt(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Position Y:
            </label>
            <input
              type="number"
              value={positionY}
              onChange={(e) => setPositionY(parseInt(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleCrop}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading || !filename}
            >
              {loading ? 'Cropping...' : 'Crop'}
            </button>
            {croppedImage && (
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
            <span className="ml-2 text-gray-300">Show Cropped Image</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CropImage; 