import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ title, description, path }) => {
    return (
        <div className="bg-gray-800/50 hover:bg-gray-800/70 rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
            <p className="text-gray-400 mb-4">{description}</p>
            <Link
                to={path}
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
                Get Started
            </Link>
        </div>
    );
};

export default Card; 