import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function DetailedStartup() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);

  useEffect(() => {
    async function fetchStartupDetails() {
      try {
        const response = await axios.get(`3000/api/startups/${id}`);
        setStartup(response.data);
      } catch (error) {
        console.error('Error fetching startup details:', error);
      }
    }

    fetchStartupDetails();
  }, [id]);

  if (!startup) return <div>Loading...</div>;

  return (
    <div className="mt-24 p-6">
      <h1 className="text-5xl font-bold text-slate-700">{startup.companyInfo}</h1>
      <img src={startup.logo} alt={startup.companyInfo} className="w-32 h-32 object-contain mt-4" />
      <p className="text-lg text-slate-500 mt-4">{startup.pitch}</p>
      <p className="text-lg text-slate-400 mt-2">Equity Offered: {startup.equityOffered}%</p>
      <p className="text-lg text-slate-400 mt-2">Valuation: ${startup.valuation}</p>
      <p className="text-lg text-slate-400 mt-2">Type: {startup.domain}</p>
      <p className="text-lg text-slate-400 mt-2">Contact: {startup.contact}</p>
      <p className="text-lg text-slate-400 mt-2">Stage: {startup.stage}</p>
      <a href={startup.website} className="text-blue-500 underline mt-4 inline-block">Visit Website</a>
      <a href={startup.linkedIn} className="text-blue-500 underline mt-4 inline-block ml-4">LinkedIn Profile</a>
    </div>
  );
}
