import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';

const ImageDropzone = ({ onImageUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full h-96 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-[1.02]
        ${isDragActive 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-gray-700 hover:border-blue-500 bg-gray-800/50 hover:bg-gray-800/70'
        }`}
    >
      <input {...getInputProps()} />
      <div className="text-center p-8">
        {isDragActive ? (
          <Upload className="w-16 h-16 mx-auto text-blue-400 mb-6 animate-bounce" />
        ) : (
          <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-6" />
        )}
        <h3 className="text-2xl font-semibold text-gray-200 mb-2">
          {isDragActive ? 'Drop your image here' : 'Upload your image'}
        </h3>
        <p className="text-gray-400 mb-6">
          Drag & drop or click to select
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <span>Supports:</span>
          {['.PNG', '.JPG', '.JPEG', '.WebP'].map((format) => (
            <span key={format} className="px-2 py-1 bg-gray-700/50 rounded">
              {format}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageDropzone;