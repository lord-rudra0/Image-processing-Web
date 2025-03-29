import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-300">
                I❤IMG
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <div className="relative group">
                <h4 className="font-semibold text-gray-200 mb-2">MODIFY</h4>
                <div className="absolute z-10 mt-2 w-48 rounded-lg shadow-lg bg-gray-800/95 backdrop-blur-sm border border-gray-700 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                  <div className="py-2">
                    <Link to="/resize-image" className="block px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Resize IMAGE</Link>
                    <Link to="/crop-image" className="block px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Crop IMAGE</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <h4 className="font-semibold text-gray-200 mb-2">CONVERT</h4>
                <div className="absolute z-10 mt-2 w-48 rounded-lg shadow-lg bg-gray-800/95 backdrop-blur-sm border border-gray-700 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                  <div className="py-2">
                    <Link to="/convert-to-jpg" className="block px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Convert to JPG</Link>
                    <Link to="/convert-from-jpg" className="block px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Convert from JPG</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <h4 className="font-semibold text-gray-200 mb-2">SECURITY</h4>
                <div className="absolute z-10 mt-2 w-48 rounded-lg shadow-lg bg-gray-800/95 backdrop-blur-sm border border-gray-700 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                  <div className="py-2">
                    <Link to="/watermark-image" className="block px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Watermark IMAGE</Link>
                    <Link to="/blur-face" className="block px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Blur Face</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition duration-150 ease-in-out"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 sm:px-3 space-y-1">
          <div className="space-y-1">
            <h4 className="px-3 py-2 text-sm font-medium text-gray-200">MODIFY</h4>
            <Link to="/resize-image" className="block px-3 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Resize IMAGE</Link>
            <Link to="/crop-image" className="block px-3 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Crop IMAGE</Link>
          </div>
          <div className="space-y-1">
            <h4 className="px-3 py-2 text-sm font-medium text-gray-200">CONVERT</h4>
            <Link to="/convert-to-jpg" className="block px-3 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Convert to JPG</Link>
            <Link to="/convert-from-jpg" className="block px-3 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Convert from JPG</Link>
          </div>
          <div className="space-y-1">
            <h4 className="px-3 py-2 text-sm font-medium text-gray-200">SECURITY</h4>
            <Link to="/watermark-image" className="block px-3 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Watermark IMAGE</Link>
            <Link to="/blur-face" className="block px-3 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200">Blur Face</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 