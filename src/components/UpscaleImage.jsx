import React, { useState, useCallback, useRef } from 'react';
import { uploadImage } from '../api/imageService';
import downloadImage from '../utils/download';
import { useDropzone } from 'react-dropzone';

const UpscaleImage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [filename, setFilename] = useState('');
    const [upscaledImage, setUpscaledImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [upscaleMethod, setUpscaleMethod] = useState('lanczos'); // Default to Lanczos
    const imageRef = useRef(null);

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

    const handleUpscale = async () => {
        setError('');
        setLoading(true);
        try {
            // Placeholder for actual upscaling logic
            // In a real implementation, you would send the filename and upscaleMethod to the backend
            // and receive the upscaled image data.
            // For now, we'll just simulate the upscaling process.
            const upscale = (method) => {
                switch (method) {
                    case 'nearest':
                        return 'Simulated Nearest Neighbor Upscaling';
                    case 'bilinear':
                        return 'Simulated Bilinear Upscaling';
                    case 'lanczos':
                        return 'Simulated Lanczos Upscaling';
                    default:
                        return 'Simulated Upscaling';
                }
            };

            const upscaledImageData = upscale(upscaleMethod);
            setUpscaledImage(upscaledImageData); // Set a text for now

        } catch (err) {
            setError(err.message || 'Upscale failed');
            console.error('Upscale failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        downloadImage(upscaledImage, `upscaled_image_${upscaleMethod}.jpg`);
    };

    return (
        <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
            <h2 className="text-2xl font-semibold mb-6">Upscale Image</h2>
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

                    {upscaledImage && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Upscaled Image:</h3>
                            <p>{upscaledImage}</p>
                        </div>
                    )}
                </div>

                <div className="w-1/2 p-4 flex flex-col justify-start">
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">
                            Upscale Method:
                        </label>
                        <select
                            value={upscaleMethod}
                            onChange={(e) => setUpscaleMethod(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                        >
                            <option value="nearest">Nearest Neighbor</option>
                            <option value="bilinear">Bilinear</option>
                            <option value="lanczos">Lanczos</option>
                        </select>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={handleUpscale}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={loading || !filename}
                        >
                            {loading ? 'Upscaling...' : 'Upscale'}
                        </button>
                        {upscaledImage && (
                            <button
                                onClick={handleDownload}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                            >
                                Download
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpscaleImage; 