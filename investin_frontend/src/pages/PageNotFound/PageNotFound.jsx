import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import notFound from "../../assets/pageNotFound.svg"

const PageNotFound = () => {
  return (
    <div className="md:flex items-center flex-wrap    justify-around min-h-screen bg-gray-100">
     
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4 animate-bounce">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Oops! Page Not Found</p>
        <Link to="/home" className="flex items-center justify-center bg-black text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
          <FaHome className="mr-2" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
