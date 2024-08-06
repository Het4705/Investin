import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import InvestorDisplay from "../InvestorDetails/InvestorDetails2";

const InvestorDashboard = () => {
  const navigate = useNavigate();

  const [investorData, setInvestorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestorData = async () => {
      try {
        const Id = Cookies.get("id");
        const response = await axios.get(
          `http://localhost:3000/api/investors/investorOf/${Id}`,
          {
            withCredentials: true,
          }
        );
        setInvestorData(response.data.result);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response) {
          if (err.response.status === 400) {
            toast.error(
              "Bad Request: The server could not understand the request."
            );
          } else if (err.response.status === 404) {
            toast.error("Investor profile not found.");
          } else {
            toast.error("An unexpected error occurred.");
          }
        } else if (err.request) {
          console.log(err.request);
          toast.error("No response received from the server.");
        } else {
          console.log("Error", err.message);
          toast.error("An error occurred while setting up the request.");
        }
      }
    };

    fetchInvestorData();
  }, []);

  const handleAddInvestor = () => {
    navigate("/addInvestor"); // Adjust this route to your actual add investor page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!investorData) {
    return (
      <div className="mt-24 h-[100vh] w-[100vw] flex justify-center items-center">
        <div className="flex w-full h-full max-w-6xl mx-auto">
          {/* Scrollable info section */}
          <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
            <h2 className="text-2xl font-bold mb-6">Why Become an Investor?</h2>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Support Innovation</h3>
              <p>
                By investing in startups, you are supporting innovation and
                helping new businesses grow.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Earn Returns</h3>
              <p>
                Invest in promising startups and potentially earn significant
                returns on your investment.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Diversify Portfolio</h3>
              <p>
                Adding startups to your investment portfolio helps diversify
                your risk and increases the potential for higher returns.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Networking Opportunities</h3>
              <p>
                Connect with other investors and industry leaders, expanding
                your professional network.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Stay Ahead of Trends</h3>
              <p>
                Be at the forefront of industry trends and innovations by
                investing in emerging startups.
              </p>
            </div>
          </div>
          {/* Register investor section */}
          <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
              <div className="text-2xl font-bold mb-4">No Investor Found</div>
              <p className="mb-4">
                It looks like you don't have an investor profile registered yet.
                Register now to get started!
              </p>
              <button
                onClick={handleAddInvestor}
                className="bg-blue-500 text-white px-6 py-3 mt-4 rounded-lg text-lg font-semibold"
              >
                Register Investor
              </button>
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-left" />
      </div>
    );
  }

  return <InvestorDisplay investorId={investorData._id} />;
};

export default InvestorDashboard;
