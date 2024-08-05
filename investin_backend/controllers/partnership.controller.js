const Partnership = require('../models/partnership.model');
const getUserDetailFromToken = require('../services/getUserDetails');
const { isValidObjectId } = require("../services/isValidObjectId");

const investmentMade = async (req, res) => {
    try {
      const investments = await Partnership.find({ company_agreed: 'true', startup_agreed: 'true' });
      const total = await Partnership.countDocuments({});
      res.status(200).json({data:investments,total});
    } catch (error) {
     
      console.error('Error fetching investments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

const raisePartnership = async (req, res) => {
    try {
        // Extract user details from the token
        const user = getUserDetailFromToken(req);
        const role = user ? user.role : null;

        // Validate user role
        if (!role) {
            return res.status(400).json({
                message: "Invalid user role"
            });
        }

        // Destructure the equity and date_of_agreement from request body
        const { equity, date_of_agreement } = req.body;

        // Validate required fields in equity
        if (!equity || equity.offered_percentage == null || equity.amount == null) {
            return res.status(400).json({
                message: "Please provide equity with offered_percentage and amount fields"
            });
        }

        // Validate date_of_agreement
        if (!date_of_agreement) {
            return res.status(400).json({
                message: "Please provide date_of_agreement"
            });
        }

        // Initialize variables for investorId, startupId, and agreement flags
        let investorId;
        let startupId;
        let company_agreed = false;
        let startup_agreed = false;

        // Determine the role and set appropriate values
        if (role === "founder") {
            startupId = user.id;
            investorId = req.params.id; // Assuming the investor's ID is passed in the request params
            if (!isValidObjectId(investorId)) {
                return res.status(400).json({
                    message: "Invalid investor ObjectId"
                });
            }
            startup_agreed = true;
        } else if (role === "investor") {
            investorId = user.id;
            startupId = req.params.id; // Assuming the startup's ID is passed in the request params
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

        // Create the partnership data object
        const partnershipData = {
            startupId,
            investorId,
            company_agreed,
            startup_agreed,
            equity,
            date_of_agreement
        };

        // Save the partnership to the database
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

        const user = getUserDetailFromToken(req);
        const role = user ? user.role : null;

        // Validate user role
        if (!role) {
            return res.status(400).json({
                message: "Invalid user role"
            });
        }

        // Validate the partnership ID and existence
        const partnership = await Partnership.findById(partnershipId);
        if (!partnership) {
            return res.status(404).json({
                message: "Partnership not found"
            });
        }

        // Update the agreement status based on the user's role
        if (role === "founder") {
            partnership.company_agreed = true;
        } else if (role === "investor") {
            partnership.startup_agreed = true;
        } else {
            return res.status(403).json({
                message: "Unauthorized role for this action"
            });
        }

        // Check if the partnership is fully agreed
        partnership.status = (partnership.company_agreed && partnership.startup_agreed) ? "Completed" : "Pending";

        // Save the updated partnership
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

module.exports = {
    raisePartnership,
    acceptPartnership,
    deletePartnership,
    investmentMade
};
