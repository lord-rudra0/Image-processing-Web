import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const navLinks = [
    { name: 'COMPRESS IMAGE', path: '/compress-image' },
    { name: 'RESIZE IMAGE', path: '/resize-image' },
    { name: 'CROP IMAGE', path: '/crop-image' },
    { name: 'CONVERT TO JPG', path: '/convert-to-jpg' },
    { name: 'PHOTO EDITOR', path: '/photo-editor' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome to I❤IMG</h1>
      <p className="text-lg text-gray-400 mb-8">
        Your all-in-one image processing website.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-5 py-3 rounded-xl transition-colors duration-300"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home; 