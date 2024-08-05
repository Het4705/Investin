import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // For navigation
import bitcoin_farm from '../../assets/bitcoin_farm.svg';
import { FaThumbsUp, FaGlobe, FaLinkedin, FaLongArrowAltRight } from 'react-icons/fa';

const domainList = ["Technology", "Finance", "Logistics", "Marketing", "Consulting", "Energy", "Biotech", "E-commerce", "Architecture"];

const stageColors = {
  "pre-seed": "text-gray-800",
  "seed": "text-yellow-800",
  "early": "text-blue-800",
  "expansion": "text-green-800"
};

export default function StartupSection() {
  const [startups, setStartups] = useState([]);
  const [filteredStartups, setFilteredStartups] = useState({});

  const navigate = useNavigate();

  const handleStartupClick = (id) => {
    navigate(`/startup/${id}`);
  };

  useEffect(() => {
    async function fetchStartups() {
      try {
        const response = await axios.get('http://localhost:3000/api/startups');
        setStartups(response.data.data);

        const groupedStartups = response.data.data.reduce((acc, startup) => {
          if (!acc[startup.domain]) acc[startup.domain] = [];
          acc[startup.domain].push(startup);
          return acc;
        }, {});

        setFilteredStartups(groupedStartups);
      } catch (error) {
        console.error('Error fetching startups:', error);
      }
    }

    fetchStartups();
  }, []);

  return (
    <div className="mt-24 flex flex-col gap-6  items-center">
      {domainList.map((domain) => (
        <div key={domain} className="w-full">
          <h2 className="text-4xl font-semibold text-slate-600 mb-6">{domain} Startups</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {filteredStartups[domain]?.slice(0, 3).map((startup) => (
              <div key={startup._id} className="bg-white shadow-lg rounded-lg p-3 w-80">
                <div className='w-full flex justify-center items-center'>
                  <img src={startup.logo} alt={startup.companyInfo} className="shadow-lg border-[3px] rounded-lg relative h-[22vh] object-contain mb-4" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-700">{startup.companyName}</h3>
                <h3 className="text-2xl font-bold text-slate-500 overflow-hidden">{startup.companyInfo}</h3>
                <p className={`text-lg font-semibold mt-2 rounded ${stageColors[startup.stage]}`}>
                  {startup.stage.charAt(0).toUpperCase() + startup.stage.slice(1)} Stage
                </p>
                <p className="text-xl text-slate-500 mt-2 overflow-hidden">{startup.pitch}</p>
                <p className="text-lg text-slate-400">Equity Offered: {startup.equityOffered}%</p>
                <p className="text-lg text-slate-400">Valuation: ${startup.valuation.toLocaleString()}</p>
                
                <div className='mt-2 flex justify-between items-center'>
                  <div className="flex items-center gap-4">
                    <p className="text-gray-600 flex items-center">
                      <FaThumbsUp className="mr-2 text-fuchsia-500" />
                      {startup.likes}
                    </p>
                    {startup.website && (
                      <a href={startup.website} target="_blank" rel="noopener noreferrer">
                        <FaGlobe className="text-gray-600 hover:text-fuchsia-500 transition-colors duration-300" />
                      </a>
                    )}
                    {startup.linkedIn && (
                      <a href={startup.linkedIn} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="text-fuchsia-700 hover:text-fuchsia-900 transition-colors duration-300" />
                      </a>
                    )}
                  </div>
                  <button 
                    onClick={() => handleStartupClick(startup._id)} 
                    className=" text-slate-950 hoverButton text-lg p-2 rounded-full  transition-transform transform hover:scale-105 active:scale-95 flex justify-center items-center gap-2"
                  >
                    Know More <FaLongArrowAltRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-10">
        <img src={bitcoin_farm} alt="Startups" />
      </div>
    </div>
  );
}
