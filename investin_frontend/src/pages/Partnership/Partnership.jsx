import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  fetchPendingPartnershipRequests,
  acceptedPartnershipRequest,
  rejectedPartnershipRequest,
  fetchRaisedPartnershipRequests,
} from "../../services/partnershipService";
import PartnershipCard from "./PartnershipCard";

export default function Partnership() {
  const [id, setId] = useState(Cookies.get("id"));
  const [loading, setLoading] = useState(true);
  const [rejectData, setRejectData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [acceptedData, setAcceptedData] = useState([]);
  const [raisedData, setRaisedData] = useState([]);
  const [view, setView] = useState("pending");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const pending = await fetchPendingPartnershipRequests(id);
        const rejected = await rejectedPartnershipRequest(id);
        const accepted = await acceptedPartnershipRequest(id);
        const raised = await fetchRaisedPartnershipRequests(id);
        setPendingData(pending);
        setRejectData(rejected);
        setAcceptedData(accepted);
        setRaisedData(raised);
      } catch (error) {
        console.error("Error loading partnership data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const renderPartnerships = (data) => {
    return data.length > 0 ? (
      data.map((partnership) => (
        <div key={partnership._id}>
          <PartnershipCard partnership={partnership} />
        </div>
      ))
    ) : (
      <div>No data available</div>
    );
  };

  return (
    <div className="flex gap-6">
      <div className="mt-24 w-[80vw] h-[90vh] p-3 flex justify-center items-start shadow-lg rounded-r-3xl bg-slate-200">
        <div className="flex flex-col justify-start items-center w-full">
          <h1 className="font-semibold text-2xl mb-4">Partnership Data</h1>
          <div className="flex flex-col h-[80%] w-full justify-start items-center bg-white shadow-lg p-3 rounded-lg overflow-auto">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {view === "accepted" && (
                  <>
                    <h3>Partnerships Made</h3>
                    {renderPartnerships(acceptedData)}
                  </>
                )}
                {view === "pending" && (
                  <>
                    <h3>Partnership Requests</h3>
                    {renderPartnerships(pendingData)}
                  </>
                )}
                {view === "rejected" && (
                  <>
                    <h3>Rejected Requests</h3>
                    {renderPartnerships(rejectData)}
                  </>
                )}
                {view === "raised" && (
                  <>
                    <h3>Raised Partnership Requests</h3>
                    {renderPartnerships(raisedData)}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-24 flex flex-col justify-center items-center p-4 rounded-lg bg-white shadow-xl h-full gap-5">
  <h3 className="text-slate-700 font-semibold text-xl">View</h3>
  <div className="flex flex-col gap-5 w-full ">
    
    <button
      onClick={() => setView("accepted")}
      className="gradientBg2 hover:scale-95 text-white p-3 text-lg rounded-lg shadow-md border-2 border-slate-400 shadow-black/80"
    >
       Accepted Partnerships
    </button>
    <button
      onClick={() => setView("pending")}
      className="gradientBg2 hover:scale-95 text-white p-3 text-lg rounded-lg shadow-md border-2 border-slate-400 shadow-black/80"
    >
       Partnership Requests
    </button>
    <button
      onClick={() => setView("rejected")}
      className="gradientBg2 hover:scale-95 text-white p-3 text-lg rounded-lg shadow-md border-2 border-slate-400 shadow-black/80"
    >
       Rejected Requests
    </button>
    <button
      onClick={() => setView("raised")}
      className="gradientBg2 hover:scale-95 text-white p-3 text-lg rounded-lg shadow-md border-2 border-slate-400 shadow-black/80"
    >
      Raised Partnerships
    </button>
  </div>
</div>

    </div>
  );
}
