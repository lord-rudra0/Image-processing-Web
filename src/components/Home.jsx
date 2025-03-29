import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
  const navLinks = [
    { name: 'COMPRESS IMAGE', path: '/compress-image' },
    { name: 'RESIZE IMAGE', path: '/resize-image' },
    { name: 'CROP IMAGE', path: '/crop-image' },
    { name: 'CONVERT TO JPG', path: '/convert-to-jpg' },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-white">Welcome to I❤IMG</h1>
      <p className="text-lg text-gray-400 mb-8">
        Your all-in-one image processing website.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="bg-gray-800/50 hover:bg-gray-800/70 text-gray-300 hover:text-white p-6 rounded-xl shadow-md transition-all duration-300"
          >
            <div className="text-center">
              <span className="text-xl font-medium">{link.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home; 