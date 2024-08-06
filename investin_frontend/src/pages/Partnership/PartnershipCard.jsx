import React, { useState } from "react";

function PartnershipCard({ partnership }) {
    const [offeredPercentage,setOfferedPercentage]=useState(int(partnership.equity.offered_percentage)%101)
  return (
    <div className="flex flex-col gap-2 justify-start items-center">

      <div>StartupId:{partnership.startupId}</div>
      <div>InvestorId:{partnership.investorId}</div>
      <div>
        <h1>Equity</h1>
        Amount:{partnership.equity.amount}
        Offered:{partnership.equity.offered_percentage}%
      </div>
      <div>
        Agreement Date:{partnership.date_of_agreement}
      </div>
      <div>
        Status:{partnership.status}
      </div>
    </div>
  );
}

export default PartnershipCard;
