import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p>&copy; {new Date().getFullYear()} I❤IMG. All rights reserved.</p>
        <a
          href="https://github.com/your-username/your-repo"
          className="hover:text-gray-300 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repository
        </a>
      </div>
    </footer>
  );
};

export default Footer; 