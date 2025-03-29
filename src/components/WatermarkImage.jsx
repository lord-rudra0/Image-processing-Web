import React, { useState, useCallback, useRef } from 'react';
import { uploadImage } from '../api/imageService';
import downloadImage from '../utils/download';
import { useDropzone } from 'react-dropzone';
import { useGesture } from '@use-gesture/react';

const WatermarkImage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [filename, setFilename] = useState('');
    const [watermarkImage, setWatermarkImage] = useState(null);
    const [watermarkFilename, setWatermarkFilename] = useState('');
    const [watermarkedImage, setWatermarkedImage] = useState(null);
    const [position, setPosition] = useState('bottom_right');
    const [opacity, setOpacity] = useState(0.5);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [watermarkUploaded, setWatermarkUploaded] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const imageRef = useRef(null);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
    const [overlaySize, setOverlaySize] = useState({ width: 100, height: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

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

    const onWatermarkDrop = useCallback(async (acceptedFiles) => {
        const watermarkFile = acceptedFiles[0];
        setWatermarkImage(URL.createObjectURL(watermarkFile));

        try {
            setLoading(true);
            const data = await uploadImage(watermarkFile);
            setWatermarkFilename(data.filename);
            setWatermarkUploaded(true);
        } catch (err) {
            setError(err.message || 'Watermark upload failed');
            console.error('Watermark upload failed:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*,.png,.jpg,.jpeg,.webp',
        multiple: false,
    });

    const { getRootProps: getWatermarkRootProps, getInputProps: getWatermarkInputProps, isDragActive: isWatermarkDragActive } = useDropzone({
        onDrop: onWatermarkDrop,
        accept: 'image/*,.png,.jpg,.jpeg,.webp',
        multiple: false,
    });

    const bind = useGesture({
        onDrag: ({ offset: [x, y] }) => {
            setOverlayPosition({ x, y });
            setX(x);
            setY(y);
        },
        onResize: ({ offset: [width, height] }) => {
            setOverlaySize({ width, height });
            setWidth(width);
            setHeight(height);
        }
    });

    const handleAddWatermark = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/watermark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: filename,
                    watermark_filename: watermarkFilename,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    opacity: opacity,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setWatermarkedImage(`data:image/jpeg;base64,${data.img}`);
            } else {
                setError(data.error || 'Watermark addition failed');
            }
        } catch (err) {
            setError(err.message || 'Watermark addition failed');
            console.error('Watermark addition failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        downloadImage(watermarkedImage, 'watermarked_image.jpg');
    };

    return (
        <div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
            <h2 className="text-2xl font-semibold mb-6">Add Watermark</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="flex">
                <div className="w-1/2 flex flex-col items-center relative">
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
                            <div className="relative">
                                <img
                                    src={selectedImage}
                                    alt="Uploaded"
                                    className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
                                    ref={imageRef}
                                />
                                <div
                                    {...bind()}
                                    style={{
                                        position: 'absolute',
                                        left: overlayPosition.x,
                                        top: overlayPosition.y,
                                        width: overlaySize.width,
                                        height: overlaySize.height,
                                        border: '2px dashed #3b82f6',
                                        cursor: 'move',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            right: -4,
                                            bottom: -4,
                                            width: 8,
                                            height: 8,
                                            backgroundColor: '#3b82f6',
                                            cursor: 'se-resize',
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    )}

                    {!watermarkUploaded ? (
                        <div
                            {...getWatermarkRootProps()}
                            role="presentation"
                            tabIndex={0}
                            className="w-full h-96 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-[1.02] border-gray-700 hover:border-blue-500 bg-gray-800/50 hover:bg-gray-800/70"
                        >
                            <input
                                {...getWatermarkInputProps()}
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
                                {isWatermarkDragActive ? (
                                    <p className="text-blue-400">Drop your watermark here</p>
                                ) : (
                                    <>
                                        <p className="text-gray-400">Drag & drop or click to select watermark</p>
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
                        watermarkImage && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Uploaded Watermark:</h3>
                                <img
                                    src={watermarkImage}
                                    alt="Uploaded Watermark"
                                    className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
                                />
                            </div>
                        )
                    )}

                    {showImage && watermarkedImage && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Watermarked Image:</h3>
                            <img
                                src={watermarkedImage}
                                alt="Watermarked"
                                className="max-w-full rounded-lg shadow-md transition-opacity duration-300"
                            />
                        </div>
                    )}
                </div>

                <div className="w-1/2 p-4 flex flex-col justify-start">
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">
                            X Coordinate:
                        </label>
                        <input
                            type="number"
                            value={x}
                            onChange={(e) => setX(parseInt(e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">
                            Y Coordinate:
                        </label>
                        <input
                            type="number"
                            value={y}
                            onChange={(e) => setY(parseInt(e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">
                            Width:
                        </label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(parseInt(e.target.value))}
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
                            onChange={(e) => setHeight(parseInt(e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">
                            Opacity:
                        </label>
                        <input
                            type="number"
                            value={opacity}
                            onChange={(e) => setOpacity(Math.max(0, Math.min(1, e.target.value)))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
                        />
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={handleAddWatermark}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={loading || !filename || !watermarkFilename}
                        >
                            {loading ? 'Adding Watermark...' : 'Add Watermark'}
                        </button>
                        {watermarkedImage && (
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
                        <span className="ml-2 text-gray-300">Show Watermarked Image</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default WatermarkImage; 