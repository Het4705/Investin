const Partnership = require('../models/partnership.model');
const getUserDetailFromToken = require('../services/getUserDetails');
const {
    isValidObjectId
} = require("../services/isValidObjectId");

const investmentMade = async (req, res) => {
    try {
        const investments = await Partnership.find({
            status: "accepted"
        })
        const total = await Partnership.countDocuments({});
        res.status(200).json({
            data: investments,
            total
        });
    } catch (error) {
        console.error('Error fetching investments:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

const raisePartnership = async (req, res) => {
    try {
        const user = getUserDetailFromToken(req);
        const role = req.cookies.role;

        if (!role) {
            return res.status(400).json({
                message: "Invalid user role"
            });
        }

        const {
            equity,
            date_of_agreement
        } = req.body;

        if (!equity || equity.offered_percentage == null || equity.amount == null) {
            return res.status(400).json({
                message: "Please provide equity with offered_percentage and amount fields"
            });
        }

        if (!date_of_agreement) {
            return res.status(400).json({
                message: "Please provide date_of_agreement"
            });
        }

        let investorId, startupId, company_agreed = false,
            startup_agreed = false;

        if (role === "founder") {
            startupId = user.id;
            investorId = req.params.id;
            if (!isValidObjectId(investorId)) {
                return res.status(400).json({
                    message: "Invalid investor ObjectId"
                });
            }
            startup_agreed = true;
        } else if (role === "investor") {
            investorId = user.id;
            startupId = req.params.id;
            if (!isValidObjectId(startupId)) {
                return res.status(400).json({
                    message: "Invalid startup ObjectId"
                });
            }
            company_agreed = true;
        } else {
            return res.status(400).json({
                message: "Invalid role. Role must be either 'founder' or 'investor'."
            });
        }

        const partnershipData = {
            startupId,
            investorId,
            company_agreed,
            startup_agreed,
            equity,
            status: "pending",
            date_of_agreement
        };

        const partnership = new Partnership(partnershipData);
        const result = await partnership.save();

        return res.status(201).json({
            message: "Partnership raised successfully",
            partnership: result
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const acceptPartnership = async (req, res) => {
    try {
        const partnershipId = req.params.id;

        if (!partnershipId) {
            return res.status(400).json({
                message: "Provide partnership 'id' in params"
            });
        }

        if (!isValidObjectId(partnershipId)) {
            return res.status(400).json({
                message: "Invalid partnership ObjectId"
            });
        }

        // const user = getUserDetailFromToken(req);
        const role = req.cookies.role

        if (!role) {
            return res.status(400).json({
                message: "Invalid user role"
            });
        }

        const partnership = await Partnership.findById(partnershipId);
        if (!partnership) {
            return res.status(404).json({
                message: "Partnership not found"
            });
        }

        if (role === "founder") {
            partnership.company_agreed = true;
        } else if (role === "investor") {
            partnership.startup_agreed = true;
        } else {
            return res.status(403).json({
                message: "Unauthorized role for this action"
            });
        }

        partnership.status = (partnership.company_agreed && partnership.startup_agreed) ? "accepted" : "pending";
        const updatedPartnership = await partnership.save();

        return res.status(200).json({
            message: "Partnership status updated successfully",
            partnership: updatedPartnership
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const deletePartnership = async (req, res) => {
    try {
        const partnershipId = req.params.id;

        if (!partnershipId) {
            return res.status(400).json({
                message: "Provide partnership 'id' in params"
            });
        }

        if (!isValidObjectId(partnershipId)) {
            return res.status(400).json({
                message: "Invalid partnership ObjectId"
            });
        }

        const result = await Partnership.findByIdAndDelete(partnershipId);
        if (!result) {
            return res.status(404).json({
                message: "Partnership not found"
            });
        }

        return res.status(200).json({
            message: "Partnership record deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const pendingPartnership = async (req, res) => {
    const role = req.cookies.role;
    const { id } = req.params;
  
    if (!role) {
      return res.status(400).json({ message: "Invalid user role" });
    }
  
    try {
      let query = {};
  
      if (role === "founder") {
        query = { startupId: id, startup_agreed: false, company_agreed: true ,status:'pending' };
      } else if (role === "investor") {
        query = { investorId: id, startup_agreed: true, company_agreed: false,status:'pending' };
      } else {
        return res.status(400).json({ message: "Invalid role. Role must be either 'founder' or 'investor'." });
      }
  
      const result = await Partnership.find(query);
  
      if (!result.length) {
        return res.status(404).json({ message: "Not Found" });
      }
  
      return res.status(200).json(result);
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  
const raisedPartnership = async (req, res) => {
    const role = req.cookies.role;
    const { id } = req.params;
  
    if (!role) {
      return res.status(400).json({ message: "Invalid user role" });
    }
  
    try {
      let query = {};
  
      if (role === "founder") {
        query = { startupId: id, startup_agreed: true, company_agreed: false ,status:'pending' };
      } else if (role === "investor") {
        query = { investorId: id, startup_agreed: false, company_agreed: true,status:'pending' };
      } else {
        return res.status(400).json({ message: "Invalid role. Role must be either 'founder' or 'investor'." });
      }
  
      const result = await Partnership.find(query);
  
      if (!result.length) {
        return res.status(404).json({ message: "Not Found" });
      }
  
      return res.status(200).json(result);
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

const acceptedPartnership = async (req, res) => {
    const role = req.cookies.role;
    const { id } = req.params;
  
    if (!role) {
      return res.status(400).json({ message: "Invalid user role" });
    }
  
    try {
      let query = {};
  
      if (role === "founder") {
        query = { startupId: id, startup_agreed: true, company_agreed: true ,status:'accepted' };
      } else if (role === "investor") {
        query = { investorId: id, startup_agreed: true, company_agreed: true,status:'accepted' };
      } else {
        return res.status(400).json({ message: "Invalid role. Role must be either 'founder' or 'investor'." });
      }
  
      const result = await Partnership.find(query);
  
      if (!result.length) {
        return res.status(404).json({ message: "Not Found" });
      }
  
      return res.status(200).json(result);
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
const rejectedPartnership = async (req, res) => {
    const role = req.cookies.role;
    const { id } = req.params;
  
    if (!role) {
      return res.status(400).json({ message: "Invalid user role" });
    }
  
    try {
      let query = {};
  
      if (role === "founder") {
        query = { startupId: id,status:'rejected' };
      } else if (role === "investor") {
        query = { investorId: id,status:'rejected' };
      } else {
        return res.status(400).json({ message: "Invalid role. Role must be either 'founder' or 'investor'." });
      }
  
      const result = await Partnership.find(query);
  
      if (!result.length) {
        return res.status(404).json({ message: "Not Found" });
      }
  
      return res.status(200).json(result);
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const rejectPartnership = async (req, res) => {
    const role = req.cookies.role;
    const { id } = req.params;
  
    if (!role) {
      return res.status(400).json({ message: "Invalid user role" });
    }
    if (!id) {
      return res.status(400).json({ message: "Invalid partnership id" });
    }
  
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid partnership ObjectId" });
    }
  
    try {
      const result = await Partnership.findByIdAndUpdate(
        id,
        { status: "rejected" },
        { new: true } // This option returns the updated document
      );
  
      if (!result) {
        return res.status(404).json({ message: "Partnership not found" });
      }
  
      return res.status(200).json({
        message: "Partnership status updated to rejected",
        partnership: result,
      });
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = {
    rejectPartnership,
  };
  

module.exports = {
    pendingPartnership,
    acceptedPartnership,
    raisePartnership,
    acceptPartnership,
    deletePartnership,
    raisedPartnership,
    rejectPartnership,
    rejectedPartnership,
    investmentMade
};