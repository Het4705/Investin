import axios from "axios";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useParams } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import "./InvestorDetail.css"; // Import the CSS file

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const InvestorDetail = ( { investorId }) => {
 
  const [investor, setInvestor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/investors/${investorId}`
        );
        if (response && response.data) {
          setInvestor(response.data);
        } else {
          console.error("Investor not found:", response.data);
        }
      } catch (error) {
        console.error("Error fetching investor:", error);
      }
    };

    fetchInvestor();
  }, [investorId]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const getChartData = () => {
    const labels = investor.companiesInvested.map(company => company.cname);
    const data = investor.companiesInvested.map(company => company.holdingShare);

    return {
      labels,
      datasets: [
        {
          label: 'Holding Share (%)',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  if (!investor) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="investor-detail-container max-w-7xl mx-auto p-6 mt-16">
      <header className="text-center my-6">
        <div>
          <h1 className="text-4xl font-bold">{investor.companyName}</h1>
        </div>
        <p className="text-gray-600 mt-2">{investor.briefInfo}</p>
      </header>
      <section className="info-section bg-white shadow-md flex justify-between items-center rounded-lg p-6 mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
          <p>
            <span className="font-bold">Address:</span>{" "}
            {`${investor.address.city}, ${investor.address.state}, ${investor.address.country}, ${investor.address.pincode}`}
          </p>
          <p>
            <span className="font-bold">Government Verified No:</span>{" "}
            {investor.companyGovtVerifiedNo}
          </p>
          <p>
            <span className="font-bold">Contact:</span> {investor.contact}
          </p>
          <p>
            <span className="font-bold">Email:</span>{" "}
            <a href={`mailto:${investor.email}`} className="text-blue-500">
              {investor.email}
            </a>
          </p>
          <p>
            <span className="font-bold">LinkedIn:</span>{" "}
            <a href={investor.linkedin} className="text-blue-500">
              {investor.linkedin}
            </a>
          </p>
          <p>
            <span className="font-bold">Website:</span>{" "}
            <a href={investor.website} className="text-blue-500">
              {investor.website}
            </a>
          </p>
        </div>
        <div>
          <img src={investor.logo} className='h-48 w-48 rounded-lg border-[3px] border-slate-400 shadow-lg' alt="" />
        </div>
      </section>
      <section className="key-people-section bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Key People</h2>
        {investor.keyPeople.map((person) => (
          <div
            key={person.name}
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => handleImageClick(person.image)}
          >
            <img
              src={person.image}
              alt={person.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="text-xl font-bold">{person.name}</h3>
              <p className="text-gray-600">{person.position}</p>
              <p className="text-gray-600">{person.info}</p>
            </div>
          </div>
        ))}
      </section>
      <section className="companies-invested-section bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Companies Invested</h2>
        {investor.companiesInvested.map((company) => (
          <div
            key={company.cname}
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => handleImageClick(company.clogo[0])}
          >
            <img
              src={company.clogo[0]}
              alt={company.cname}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="text-xl font-bold">{company.cname}</h3>
              <p className="text-gray-600">{company.info}</p>
              <p className="text-gray-600">
                Holding Share: {company.holdingShare}%
              </p>
            </div>
          </div>
        ))}
        
        {/* Bar Graph Section */}
        <div className="bar-graph-section bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Holding Share Visualization</h2>
          <Bar data={getChartData()} options={{ responsive: true }} />
        </div>
      </section>
      <section className="images-section bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Images</h2>
        <Carousel
          className="custom-carousel h-max"
          autoPlay
          infiniteLoop
          showThumbs={false}
          showArrows={true}
          showStatus={false}
        >
          {investor.images.map((image, index) => (
            <div key={index} onClick={() => handleImageClick(image)}>
              <img
                src={image}
                alt={`Slide ${index}`}
                className="carousel-image cursor-pointer"
              />
            </div>
          ))}
        </Carousel>
      </section>

      {selectedImage && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={handleCloseModal}>
              &times;
            </span>
            <img src={selectedImage} alt="Selected" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorDetail;
