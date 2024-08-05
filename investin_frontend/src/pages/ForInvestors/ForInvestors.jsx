import React, { useState, useEffect } from "react";
import axios from "axios";
import InvestorCard from "../../components/InvestorCard/InvestorCard";
import { useNavigate } from "react-router-dom";
import CountUp from 'react-countup';
import investorImage from "../../assets/invest_graph.svg";

const ForInvestor = () => {
  const navigate = useNavigate();

  const [investors, setInvestors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust as necessary
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalInvestors, setTotalInvestors] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);

  useEffect(() => {
    fetchInvestors();
  }, [currentPage, sortOrder]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      fetchSuggestions(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const fetchInvestmentsMade = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/investments'); // Adjust the endpoint
      setTotalInvestments(response.data.totalInvestments);
    } catch (error) {
      console.log("Error in fetching investments:", error);
    }
  };

  const fetchInvestors = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/investors?page=${currentPage}&limit=${itemsPerPage}`
      );
      setTotalInvestors(response.data.total);
      if (response.data && response.data.data) {
        const sortedInvestors =
          sortOrder === "asc"
            ? response.data.data.sort((a, b) =>
                a.companyName.localeCompare(b.companyName)
              )
            : response.data.data.sort((a, b) =>
                b.companyName.localeCompare(a.companyName)
              );

        setInvestors(sortedInvestors);
        setTotalPages(response.data.totalPages);
        setFilteredInvestors(sortedInvestors);
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching investors:", error);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/investors/suggestions?query=${query}`
      );
      if (response.data && response.data.suggestions) {
        setSuggestions(response.data.suggestions);
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchInvestorById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/investors/${id}`
      );
      if (response.data && response.data.investor) {
        setSelectedInvestor(response.data.investor);
      } else {
        console.error("Investor not found:", response.data);
      }
    } catch (error) {
      console.error("Error fetching investor by ID:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    const filtered = investors.filter(
      (investor) =>
        investor.companyName.toLowerCase().includes(query.toLowerCase()) ||
        investor.likes.toString().includes(query)
    );
    setFilteredInvestors(filtered);
  };

  const handleSuggestionClick = async (suggestion) => {
    setSearchTerm(suggestion.companyName);
    setSuggestions([]);
    const investor = investors.find((inv) => inv._id === suggestion._id);
    if (investor) {
      setFilteredInvestors([investor]);
    } else {
      await fetchInvestorById(suggestion._id);
    }
  };

  const handleInvestorClick = (id) => {
    navigate(`/investor/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen bg-gray-100">
      <div className="mt-24">
        <div>
          <h1 className="text-6xl mt-10 font-bold text-slate-700">
            Meet The OG's
          </h1>
          <h1 className="text-4xl font-bold text-slate-700">The Investors</h1>
        </div>
        <div className="flex justify-around gap-10 items-center flex-wrap">
          <div className="h-[50vh] w-[50vh] flex justify-center items-center bg-slate-300/50 rounded-[14%]">
            <div className="h-[90%] w-[90%] justify-evenly items-center p-2 bg-center flex flex-col first-letter:bg-white rounded-[14%] gradientBg text-white">
              <h3 className="text-5xl text-center">
                Investors Onboard:
                <CountUp end={totalInvestors} duration={4} />
              </h3>
              <h3 className="text-3xl">Investment Made: {totalInvestments}</h3>
            </div>
          </div>
          <img
            src={investorImage}
            className="h-auto w-[50%]"
            alt="Investors"
          />
        </div>
      </div>
      <div className="flex flex-col w-[90%] justify-center items-center">
        <h2 className="text-slate-600 text-5xl mt-10">
          Innovation Meets Opportunity
        </h2>
        <p className="text-xl text-center mt-3 text-slate-400">Our network of investors brings a wealth of experience and capital to the table. Connect with the trailblazers who are fueling innovation and growth across various industries.</p>
      </div>
      <div className="mt-16 flex flex-col gap-4 justify-start items-center w-full max-w-6xl bg-white rounded-lg shadow-lg p-6">
        <div className="w-full flex justify-between items-center mb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by company name or likes..."
              value={searchTerm}
              onChange={handleSearch}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border rounded shadow-lg z-10">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion._id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion.companyName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <select
            value={sortOrder}
            onChange={(e) => handleSortOrderChange(e.target.value)}
            className="ml-4 p-2 border rounded text-gray-700"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="overflow-y-scroll h-[75vh] w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {filteredInvestors.map((investor) => (
              <InvestorCard
                key={investor._id}
                investor={investor}
                onClick={() => handleInvestorClick(investor._id)}
              />
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-center w-full">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForInvestor;
