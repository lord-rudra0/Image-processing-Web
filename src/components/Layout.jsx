import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      <header>
        <Navbar />
      </header>
      <main className="max-w-7xl mx-auto py-8 px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 