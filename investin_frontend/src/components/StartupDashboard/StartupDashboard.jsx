import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const StartupDashboard = () => {
  const navigate = useNavigate()

  const [startupData, setStartupData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartupData = async () => {
        try {
            const Id = Cookies.get('id');
            const response = await axios.get(`http://localhost:3000/api/startups/startupOf/${Id}`, {
                withCredentials: true
            });
            setStartupData(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.response) {
               
                if (err.response.status === 400) {
                    toast.error("Bad Request: The server could not understand the request.");
                  }else if(err.response.status==404){
                  
                } 
                else {
                    toast.error("An unexpected error occurred.");
                }
                setError(err.response.data.message || "Some Error Occurred. Check Console.");
            } else if (err.request) {
           
                console.log(err.request);
                toast.error("No response received from the server.");
            } else {
              
                console.log('Error', err.message);
                toast.error("An error occurred while setting up the request.");
            }
        }
    };

    fetchStartupData();
}, []);

  const handleAddStartup = () => {
    navigate('/addStartup'); // Adjust this route to your actual add startup page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!startupData) {
    return (
      <div className="mt-24 h-[100vh] w-[100vw] flex justify-center items-center">
        <div className="flex w-full h-full max-w-6xl mx-auto">
          {/* Scrollable info section */}
          <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
            <h2 className="text-2xl font-bold mb-6">Why Register Your Startup?</h2>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Connect with Investors</h3>
              <p>Our platform connects you with top investors and helps you get the funding you need to grow your business.</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Expand Your Network</h3>
              <p>With a wide network of venture capitalists and angel investors, your startup will get the exposure it deserves.</p>
            </div>
            <h2 className="text-2xl font-bold mb-6">Our Plans</h2>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Basic Plan</h3>
              <p className="text-xl font-bold mb-2">$49/month</p>
              <p>Get access to a limited number of investors and resources.</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Pro Plan</h3>
              <p className="text-xl font-bold mb-2">$99/month</p>
              <p>Unlock more features and connect with more investors.</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Enterprise Plan</h3>
              <p className="text-xl font-bold mb-2">$199/month</p>
              <p>Get the full suite of features and dedicated support to scale your startup.</p>
            </div>
          </div>
          {/* Register startup section */}
          <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
              <div className="text-2xl font-bold mb-4">No Startup Found</div>
              <p className="mb-4">It looks like you don't have a startup registered yet. Register now to get started!</p>
              <button onClick={handleAddStartup} className="bg-blue-500 text-white px-6 py-3 mt-4 rounded-lg text-lg font-semibold">
                Register Startup
              </button>
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-left" />
      </div>
    );
  }

  return (
    <>
    startup
    </>
    // <div className="p-4 mt-16">
    //   <h1 className="text-2xl font-bold mb-4">{startupData.companyName}</h1>
    //   <img src={startupData.logo} alt={`${startupData.companyName} logo`} className="w-32 h-32 mb-4" />
    //   <p className="mb-2"><strong>Email:</strong> {startupData.email}</p>
    //   <p className="mb-2"><strong>Company Info:</strong> {startupData.companyInfo}</p>
    //   <p className="mb-2"><strong>Domain:</strong> {startupData.domain}</p>
    //   <p className="mb-2"><strong>Pitch:</strong> {startupData.pitch}</p>
    //   <p className="mb-2"><strong>Contact:</strong> {startupData.contact}</p>
    //   <p className="mb-2"><strong>Equity Offered:</strong> {startupData.equityOffered}%</p>
    //   <p className="mb-2"><strong>Valuation:</strong> ${startupData.valuation}</p>
    //   <p className="mb-2"><strong>Website:</strong> <a href={startupData.website} target="_blank" rel="noopener noreferrer">{startupData.website}</a></p>
    //   <p className="mb-2"><strong>LinkedIn:</strong> <a href={startupData.linkedIn} target="_blank" rel="noopener noreferrer">{startupData.linkedIn}</a></p>
    //   <p className="mb-2"><strong>Stage:</strong> {startupData.stage}</p>
    //   <p className="mb-2"><strong>Likes:</strong> {startupData.likes}</p>
    //   <p className="mb-2"><strong>Company Govt Verified No:</strong> {startupData.companyGovtVerifiedNo}</p>

    //   <h2 className="text-xl font-bold mt-4">Key People</h2>
    //   {startupData.keyPeople.map(person => (
    //     <div key={person._id} className="mb-4 flex items-start space-x-4">
    //       <img src={person.image} alt={person.name} className="w-16 h-16 rounded-full" />
    //       <div>
    //         <p><strong>Name:</strong> {person.name}</p>
    //         <p><strong>Position:</strong> {person.position}</p>
    //         <p><strong>Role:</strong> {person.role}</p>
    //         <p><strong>Info:</strong> {person.info}</p>
    //       </div>
    //     </div>
    //   ))}

    //   <h2 className="text-xl font-bold mt-4">Shareholder Pattern</h2>
    //   {startupData.shareholderPattern.map(shareholder => (
    //     <div key={shareholder._id} className="mb-4">
    //       <p><strong>Investor:</strong> {shareholder.investor}</p>
    //       <p><strong>Holding Percentage:</strong> {shareholder.holdingPercentage}%</p>
    //     </div>
    //   ))}

    //   <h2 className="text-xl font-bold mt-4">Clients</h2>
    //   {startupData.clients.map(client => (
    //     <div key={client._id} className="mb-4">
    //       <p><strong>Client Name:</strong> {client.clientName}</p>
    //       <p><strong>Work:</strong> {client.work}</p>
    //       <p><strong>Info:</strong> {client.info}</p>
    //       <div className="flex flex-wrap gap-2">
    //         {client.images.map((image, index) => (
    //           <img key={index} src={image} alt={`${client.clientName} ${index + 1}`} className="w-24 h-24 object-cover" />
    //         ))}
    //       </div>
    //     </div>
    //   ))}
    //   <ToastContainer position="bottom-left" />
    // </div>
  );
};

export default StartupDashboard;
