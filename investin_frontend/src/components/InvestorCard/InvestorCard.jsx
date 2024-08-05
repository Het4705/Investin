import React from 'react';
import { FaThumbsUp, FaGlobe, FaLinkedin } from 'react-icons/fa';

const InvestorCard = ({ investor, onClick }) => {
    return (
        <div 
            className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 hover:bg-gray-100"
            onClick={onClick}
        >
            <div className="flex justify-center mb-4">
                <img 
                    src={investor.logo} 
                    alt={investor.companyName} 
                    className="h-28 w-28 rounded-xl shadow-lg border-2 border-gray-500 " 
                />
            </div>
            <h3 className="text-xl font-bold text-center mb-2 text-gray-800">{investor.companyName}</h3>
            <p className="text-center text-gray-700 mb-4">{investor.briefInfo}</p>
            <div className='flex gap-1 justify-center items-center mb-4'>
                <h3 className="text-gray-800">Companies Invested:</h3>
                <span className="text-fuchsia-600">{investor.companiesInvested.length}</span>
            </div>
            <div className="flex justify-around items-center">
                <p className="text-gray-600 flex items-center">
                    <FaThumbsUp className="mr-2 text-fuchsia-500" />
                    {investor.likes}
                </p>
                {investor.website && (
                    <a href={investor.website} target="_blank" rel="noopener noreferrer">
                        <FaGlobe className="text-gray-600 hover:text-fuchsia-500 transition-colors duration-300" />
                    </a>
                )}
                {investor.linkedin && (
                    <a href={investor.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="text-fuchsia-700 hover:text-fuchsia-900 transition-colors duration-300" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default InvestorCard;
