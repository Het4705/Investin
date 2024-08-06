import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./StartupDetails.css";
import loader from "../../assets/biglogo.png";

const StartupDisplay = ({startupId}) => {
  
  const [startup, setStartup] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  
    const fetchStartupData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/startups/${startupId}`
        );
        setStartup(response.data);
      } catch (err) {
        setError(err);
        toast.error(`Error fetching data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStartupData();
  }, [startupId]);

  if (loading) {
    return (
      <div className="loading-container">
        <img src={loader} alt="Loading" className="loading-image" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error fetching data: {error.message}</p>
      </div>
    );
  }

  if (!startup) {
    return <div>No data available</div>;
  }

  const shareholderData = {
    labels: startup.shareholderPattern
      ? [...startup.shareholderPattern.map((s) => s.investor), "Company"]
      : ["Company"],
    datasets: [
      {
        data: startup.shareholderPattern
          ? [
              ...startup.shareholderPattern.map((s) => s.holdingPercentage),
              100 -
                startup.shareholderPattern.reduce(
                  (acc, s) => acc + s.holdingPercentage,
                  0
                ),
            ]
          : [100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };
 

  return (
    <div className="startup-details mt-24">
      <ToastContainer />
      <header className="startup-header flex flex-col justify-center items-start">
       <div className="">
        <img
          src={startup.logo}
          alt={startup.companyName}
          className="startup-logo"
          />
        <h1>{startup.companyName}</h1>
      </div>

        <p className="pitch">{startup.pitch}</p>
      </header>
      <section className="startup-info">
        <div className="info-item">
          <h2>Company Information</h2>
          <p>{startup.companyInfo}</p>
        </div>
        <div className="info-item">
          <h2>Key People</h2>
          {startup.keyPeople && startup.keyPeople.length > 0 ? (
            startup.keyPeople.map((person) => (
              <div key={person._id} className="key-person">
                <img
                  src={person.image}
                  alt={person.name}
                  className="person-image"
                />
                <div className="person-details">
                  <h3>{person.name}</h3>
                  <p>
                    {person.position} - {person.role}
                  </p>
                  <p>{person.info}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No key people listed</p>
          )}
        </div>
        <div className="info-item">
  <h2>Shareholder Pattern</h2>
  <div className="chart-container">
    <Pie data={shareholderData} />
    {startup.shareholderPattern && startup.shareholderPattern.length > 0 ? (
      <table className="shareholder-table">
        <thead>
          <tr>
            <th>Investor</th>
            <th>Holding Percentage</th>
          </tr>
        </thead>
        <tbody>
          {startup.shareholderPattern.map((shareholder) => (
            <tr key={shareholder.investor}>
              <td>{shareholder.investor}</td>
              <td>{shareholder.holdingPercentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>100% owned by company</p>
    )}
  </div>
</div>

        <div className="info-item">
          <h2>Clients</h2>
          {startup.clients && startup.clients.length > 0 ? (
            startup.clients.map((client) => (
              <div key={client._id} className="client">
                <h3>{client.clientName}</h3>
                <p>{client.work}</p>
                <img
                  src={client.images[0]}
                  alt={client.clientName}
                  className="client-image"
                />
                <p>{client.info}</p>
              </div>
            ))
          ) : (
            <p>No clients listed</p>
          )}
        </div>
        <div className="info-item">
          <h2>Details</h2>
          <p>
            <strong>Stage:</strong> {startup.stage}
          </p>
          <p>
            <strong>Equity Offered:</strong> {startup.equityOffered}%
          </p>
          <p>
            <strong>Valuation:</strong> ${startup.valuation}
          </p>
          <p>
            <strong>Contact:</strong> {startup.contact}
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a href={startup.website} target="_blank" rel="noopener noreferrer">
              {startup.website}
            </a>
          </p>
          <p>
            <strong>LinkedIn:</strong>{" "}
            <a
              href={startup.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
            >
              {startup.linkedIn}
            </a>
          </p>
        </div>
      </section>
      <footer className="startup-footer">
        <p>
          <strong>Likes:</strong> {startup.likes}
        </p>
        <p>
          <strong>Government Verified Number:</strong>{" "}
          {startup.companyGovtVerifiedNo}
        </p>
      </footer>
    </div>
  );
};

export default StartupDisplay;
