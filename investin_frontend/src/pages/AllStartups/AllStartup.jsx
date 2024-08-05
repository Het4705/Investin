import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import StartupCard from "../../components/StartupCard/StartupCard2";

const AllStartups = () => {
  const [startups, setStartups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    startupType:"",
    stage: "",
    minEquityOffered: "",
    maxEquityOffered: "",
    minValuation: "",
    maxValuation: ""
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchStartups = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/startups`, {
        params: {
          page,
          limit: 10,
          search: searchQuery,
          ...filters
        }
      });
      setStartups((prevStartups) => [...prevStartups, ...response.data.data]);
      setHasMore(response.data.data.length > 0);
    } catch (error) {
      console.error("Error fetching startups:", error);
    }
  }, [page, searchQuery, filters]);

  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

  useEffect(() => {
    setPage(1);
    setStartups([]);
  }, [searchQuery, filters]);

  const lastStartupElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto mt-24 w-[90vw]  p-5 rounded-3xl shadow-xl">
      <div>

      
      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name"
          className="p-2 border rounded"
        />
        <div className="flex gap-4">
          <select name="type" value={filters.type} onChange={handleFilterChange} className="p-2 border rounded">
            <option value="">All Types</option>
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>
          <select name="stage" value={filters.stage} onChange={handleFilterChange} className="p-2 border rounded">
            <option value="">All Stages</option>
            <option value="pre-seed">Pre-Seed</option>
            <option value="seed">Seed</option>
            <option value="early">Early</option>
            <option value="expansion">Expansion</option>
          </select>
          <input
            type="number"
            name="minEquityOffered"
            value={filters.minEquityOffered}
            onChange={handleFilterChange}
            placeholder="Min Equity %"
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="maxEquityOffered"
            value={filters.maxEquityOffered}
            onChange={handleFilterChange}
            placeholder="Max Equity %"
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="minValuation"
            value={filters.minValuation}
            onChange={handleFilterChange}
            placeholder="Min Valuation"
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="maxValuation"
            value={filters.maxValuation}
            onChange={handleFilterChange}
            placeholder="Max Valuation"
            className="p-2 border rounded"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {startups.map((startup, index) => {
          if (startups.length === index + 1) {
            return <StartupCard ref={lastStartupElementRef} key={startup._id} startup={startup} />;
          } else {
            return <StartupCard key={startup._id} startup={startup} />;
          }
        })}
      </div>
    </div>
    </div>
  );
};

export default AllStartups;
