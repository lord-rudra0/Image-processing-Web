import React from 'react';
import { Download, RotateCcw } from 'lucide-react';

const ToolbarPanel = ({ onReset, onDownload, hasImage }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">
        Image Editor
      </h2>
      <div className="flex gap-3">
        <button
          onClick={onReset}
          disabled={!hasImage}
          className="btn-secondary"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </button>
        <button
          onClick={onDownload}
          disabled={!hasImage}
          className="btn-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
      </div>
    </div>
  );
};

export default ToolbarPanel; 