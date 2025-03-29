import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage, blurFace } from '../api/imageService';
import downloadImage from '../utils/download';

const BlurFace = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [filename, setFilename] = useState('');
    const [blurredImage, setBlurredImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);

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

    const handleBlurFace = async () => {
        setError('');
        setLoading(true);
        try {
            const data = await blurFace(filename);
            if (data && data.success) {
                setBlurredImage(`data:image/jpeg;base64,${data.img}`);
            } else {
                setError(data.error || 'Face blur failed');
            }
        } catch (err) {
            setError(err.message || 'Face blur failed');
            console.error('Face blur failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        downloadImage(blurredImage, 'blurred_face.jpg');
    };

    return (
        <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
            <h2 className="text-2xl font-semibold mb-6">Blur Face</h2>
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
                                />
                            </div>
                        )
                    )}

                    {blurredImage && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Blurred Image:</h3>
                            <img
                                src={blurredImage}
                                alt="Blurred"
                                className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
                            />
                        </div>
                    )}
                </div>

                <div className="w-1/2 p-4 flex flex-col justify-start">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={handleBlurFace}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loading || !filename}
                        >
                            {loading ? 'Processing...' : 'Blur Face'}
                        </button>
                        {blurredImage && (
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

export default BlurFace; 