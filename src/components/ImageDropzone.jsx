import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';

const ImageDropzone = ({ onImageUpload }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full h-full flex flex-col items-center justify-center p-8
        border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
        ${isDragActive 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <svg
          className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${
            isDragActive ? 'text-indigo-500' : 'text-slate-400'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          {isDragActive ? 'Drop your image here' : 'Upload your image'}
        </h3>
        <p className="text-slate-500 mb-4">
          Drag & drop or click to select
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <span>Supports:</span>
          {['.PNG', '.JPG', '.JPEG', '.WebP'].map((format) => (
            <span key={format} className="px-2 py-1 bg-slate-100 rounded">
              {format}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageDropzone;