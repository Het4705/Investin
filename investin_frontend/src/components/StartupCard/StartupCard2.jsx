import React from 'react';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaGlobe, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const StartupCard2 = React.forwardRef(({ startup }, ref) => {
  const { logo, companyName, pitch, equityOffered, valuation, stage, website, linkedIn, email } = startup;

  return (
    <div ref={ref} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative">
        {logo && (
          <img src={logo} alt={`${companyName} logo`} className="w-full h-52 object-cover" />
        )}
        <div className="absolute bottom-0 left-0 p-4 bg-gray-800 text-white rounded-tr-3xl">
          <h2 className="text-2xl font-bold">{companyName}</h2>
          <span className="text-sm">{stage}</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-700 mb-4">{pitch}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 font-semibold">Equity Offered:</span>
          <span className="text-gray-900">{equityOffered}%</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700 font-semibold">Valuation:</span>
          <span className="text-gray-900">${valuation}</span>
        </div>
        <div className="flex gap-4 mb-4">
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
              <FaGlobe className="text-xl" />
            </a>
          )}
          {linkedIn && (
            <a href={linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
              <FaLinkedin className="text-xl" />
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="text-gray-600 hover:text-gray-800">
              <FaEnvelope className="text-xl" />
            </a>
          )}
        </div>
        <Link
          to={`/startup/${startup._id}`}
          className="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold"
        >
          <FaInfoCircle className="mr-2" />
          View Details
        </Link>
      </div>
    </div>
  );
});

export default StartupCard2;
