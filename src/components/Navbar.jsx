import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { 
      title: "MODIFY", 
      links: [
        { name: "Compress IMAGE", path: "/compress-image" },
        { name: "Resize IMAGE", path: "/resize-image" },
        { name: "Crop IMAGE", path: "/crop-image" },
        { name: "Upscale IMAGE", path: "/upscale-image" }
      ]
    },
    { 
      title: "CONVERT", 
      links: [
        { name: "Convert to JPG", path: "/convert-to-jpg" },
        { name: "Convert from JPG", path: "/convert-from-jpg" }
      ]
    },
    { 
      title: "EDIT", 
      links: [
        { name: "Photo Editor", path: "/photo-editor" }
      ]
    },
    { 
      title: "SECURITY", 
      links: [
        { name: "Watermark IMAGE", path: "/watermark-image" },
        { name: "Blur Face", path: "/blur-face" },
        { name: "Remove Background", path: "/remove-background" }
      ]
    }
  ];

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 fixed w-full z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-purple-500 hover:to-blue-400 transition-all duration-500">
                VisionCraft❤
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((section, index) => (
              <div key={index} className="relative group">
                <h4 className="font-semibold text-gray-200 hover:text-blue-400 transition-colors duration-300 cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-800/50">
                  {section.title}
                </h4>
                <div className="absolute z-20 mt-2 w-56 origin-top-right rounded-xl shadow-lg bg-gray-800/95 backdrop-blur-sm border border-gray-700 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                  <div className="py-2">
                    {section.links.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.path}
                        className={`block px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200 ${
                          location.pathname === link.path ? 'bg-gray-700/50 text-gray-300' : ''
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-gray-900/95 backdrop-blur-sm border-b border-gray-800`}>
        <div className="px-2 pt-2 pb-4 space-y-1">
          {navLinks.map((section, index) => (
            <div key={index}>
              <h4 className="px-3 py-2 text-sm font-medium text-gray-200">{section.title}</h4>
              {section.links.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className={`block px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors duration-200 ${
                    location.pathname === link.path ? 'bg-gray-700/50 text-gray-300' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 