import React, { useState } from "react";
import startupImage from "../../assets/startup.svg";

import StartupSection from "../../components/StartupSection/StartupSection";
import { useNavigate } from "react-router-dom";

export default function ForStartups() {
  const [startupCount, setStartupCount] = useState(0);
  const [productBasedCount, setProductBasedCount] = useState(0);
  const [serviceBasedCount, setServiceBasedCount] = useState(0);
  const navigate = useNavigate();
 const handleViewAll=()=>{
  navigate("/allStartups")
 }
  return (
    <div className="mt-24 flex flex-col gap-6 justify-start items-center">
      <h1 className="text-5xl my-10 font-bold text-slate-700">Our Startups</h1>
      <div className="flex justify-around gap-10 items-center flex-wrap">
        <div className="shadow-lg h-[50vh] w-[50vh] flex justify-center items-center bg-slate-300/50 rounded-[14%] ">
          <div className="h-[90%] w-[90%] justify-evenly items-center p-2 bg-center flex flex-col bg-white rounded-[14%] gradientBg text-white ">
            <h3 className="text-5xl text-center">
              Startups Registered:
              {startupCount}
            </h3>

            <h3 className="text-3xl">
              Product Startup:
              {productBasedCount}
            </h3>

            <h3 className="text-3xl">
              Service Startup :
              {serviceBasedCount}
            </h3>
          </div>
        </div>
        <img className="shadow-sm" src={startupImage} alt="" />
      </div>
      <div className="w-[90%] gap-5 mt-8 flex flex-col justify-start items-center">
        <h3 className="text-5xl text-slate-500">
          At{" "}
          <span
            className="text-slate-700 font-bold hover:cursor-pointer"
            onClick={() => navigate("/home")}
          >
            InvestIn
          </span>
        </h3>
        <p>
          <p className="text-xl text-center text-slate-500 mb-10">
            We are passionate about innovation and entrepreneurship. Our startups are dedicated to solving real-world problems through cutting-edge technology and creative solutions. Explore our diverse portfolio and discover how we're shaping the future.
          </p>
        </p>
      </div>
      <div className="bg-slate-100 shadow-lg p-10 w-[90%] rounded-3xl relative">
        <div className="mb-10">
          <button onClick={()=>handleViewAll()}
            className="gradientBg2 text-white p-3 text-xl rounded-lg shadow-md border-2 border-slate-400 shadow-black/80 sticky top-10"
          >
            View All Startups
          </button>
        </div>
        <StartupSection />
      </div>
    </div>
  );
}
