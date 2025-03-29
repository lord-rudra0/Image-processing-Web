import React, { useState } from "react";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-gray-900 shadow-2xl">
      {/* Logo */}
      <div className="text-xl font-bold flex items-center text-gray-100">
        <span className="text-gray-100">I</span>
        <span className="text-blue-500">❤</span>
        <span className="text-gray-100">IMG</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex space-x-8 text-gray-300 font-medium">
        <a href="#" className="hover:text-gray-200 transition-colors duration-200">COMPRESS IMAGE</a>
        <a href="#" className="hover:text-gray-200 transition-colors duration-200">RESIZE IMAGE</a>
        <a href="#" className="hover:text-gray-200 transition-colors duration-200">CROP IMAGE</a>
        <a href="#" className="hover:text-gray-200 transition-colors duration-200">CONVERT TO JPG</a>
        <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors duration-200">PHOTO EDITOR</a>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none hover:text-gray-200 transition-colors duration-200 flex items-center"
          >
            MORE TOOLS ▾
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-4 z-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">OPTIMIZE</h4>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Compress IMAGE</a>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Upscale</a>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Remove background</a>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">CREATE</h4>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Meme generator</a>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Photo editor</a>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">MODIFY</h4>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Resize IMAGE</a>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Crop IMAGE</a>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Rotate IMAGE</a>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">CONVERT</h4>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Convert to JPG</a>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Convert from JPG</a>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">HTML to IMAGE</a>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">SECURITY</h4>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Watermark IMAGE</a>
                  <a href="#" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 py-1">Blur face</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login & Signup */}
      <div className="flex space-x-6">
        <a href="#" className="text-gray-300 hover:text-gray-200 transition-colors duration-200">Login</a>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg">Sign up</button>
      </div>
    </nav>
  );
} 