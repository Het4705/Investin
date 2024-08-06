const Investor = require('../models/investors.model');
const getUserDetailFromToken = require('../services/getUserDetails');
const {
    uploadOnCloudinary,
    deleteFromCloudinary
} = require("../services/cloudinary")
const {
    isValidObjectId
} = require("../services/isValidObjectId")


const addInvestor = async (req, res) => {
    const uploadedImages = [];
    const uploadedKeyPeopleImages = [];
    const uploadedCLogos = [];
    let CompanyLogo = "";

    

    try {
        console.log("Debug: Starting addInvestor function");
        const admin_id = req.cookies.id
        if (!admin_id) {
            return res.status(400).json({
                msg: "Please login again"
            });
        }
        const {
            companyName,
            companyGovtVerifiedNo,
            keyPeople,
            companiesInvested,
            briefInfo,
            contact,
            email,
            address,
            likes = 0,
            website,
            linkedIn
        } = req.body;

        if (!req.files || !(req.body.companiesInvested.length == req.files.Clogos.length) || !(req.body.keyPeople.length == req.files.keyPeopleImages.length)) {
            console.log("Debug: File validation failed");
            return res.status(400).json({
                msg: "You have either not provided company logo for every company in which you have invested or image for every key person you have registered"
            });
        }

        // Validate required fields
        if (!companyName || !companyGovtVerifiedNo || !keyPeople || !companiesInvested || !briefInfo || !contact || !email || !address) {
            console.log("Debug: Required fields validation failed");
            return res.status(400).json({
                message: "Please provide companyName, companyGovtVerifiedNo, keyPeople, companiesInvested, briefInfo, contact, email, and address"
            });
        }

        // Validate address fields
        const {
            city,
            state,
            country,
            pincode
        } = address;
        if (!city || !state || !country || !pincode) {
            console.log("Debug: Address validation failed");
            return res.status(400).json({
                message: "Please provide city, state, country, and pincode inside address object"
            });
        }

        // Validate companiesInvested
        for (let company of companiesInvested) {
            const {
                cname,
                info,
                holdingShare
            } = company;
            if (!cname || !info || !holdingShare) {
                console.log("Debug: CompaniesInvested validation failed");
                return res.status(400).json({
                    message: "Each CompanyInvested object should have cname, info and holding share"
                });
            }
        }

        // Validate keyPeople array
        if (!Array.isArray(keyPeople) || keyPeople.length === 0) {
            console.log("Debug: keyPeople validation failed");
            return res.status(400).json({
                message: "keyPeople should be a non-empty array"
            });
        }

        for (let person of keyPeople) {
            const {
                name,
                position,
                info
            } = person;
            if (!name || !position || !info) {
                console.log("Debug: keyPeople object validation failed");
                return res.status(400).json({
                    message: "Each keyPeople object should have name, position, and info"
                });
            }
        }

        // Handle images upload
        if (req.files && req.files.images) {
            console.log("Debug: Starting images upload");
            for (const file of req.files.images) {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) {
                    uploadedImages.push(uploadResult.url);
                }
            }
            console.log("Debug: Images upload complete");
        }

        // Handle company logo upload
        if (req.files && req.files.logo && req.files.logo[0]) {
            console.log("Debug: Starting company logo upload");
            const uploadResult = await uploadOnCloudinary(req.files.logo[0].path);
            if (uploadResult) {
                CompanyLogo = uploadResult.url;
            }
            console.log("Debug: Company logo upload complete");
        }

        // Handle keyPeople image uploads
        if (req.files && req.files.keyPeopleImages) {
            console.log("Debug: Starting keyPeople images upload");
            for (const file of req.files.keyPeopleImages) {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) {
                    uploadedKeyPeopleImages.push(uploadResult.url);
                }
            }
            console.log("Debug: keyPeople images upload complete");
        }

        // Handle companiesInvested clogo uploads
        if (req.files && req.files.Clogos) {
            console.log("Debug: Starting companiesInvested logos upload");
            for (const file of req.files.Clogos) {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) {
                    uploadedCLogos.push(uploadResult.url);
                }
            }
            console.log("Debug: companiesInvested logos upload complete");
        }

        // Create a new Investor instance
        console.log("Debug: Creating new Investor instance");
        const investor = new Investor({
            companyName,
            companyGovtVerifiedNo,
            keyPeople: keyPeople.map(person => ({
                ...person,
                image: uploadedKeyPeopleImages.shift()
            })),
            companiesInvested: companiesInvested.map(company => ({
                ...company,
                clogo: uploadedCLogos.shift()
            })),
            briefInfo,
            contact,
            email,
            address,
            website,
            linkedIn,
            likes,
            admin_id,
            images: uploadedImages,
            logo: CompanyLogo // Save the company logo URL
        });

        // Save the investor to the database
        console.log("Debug: Saving investor to the database");
        const result = await investor.save();

        if (result) {
            console.log("Debug: Investor saved successfully");
            return res.status(201).json({
                message: "Investor added successfully",
                investor: result
            });
        } else {
            console.log("Debug: Failed to save the investor");
            throw new Error("Failed to save the investor");
        }

    } catch (error) {
        console.log("Debug: An error occurred", error.message);
        // Delete uploaded images if any error occurs
        if (uploadedImages.length > 0) {
            console.log("Debug: Deleting uploaded images");
            for (const imageUrl of uploadedImages) {
                await deleteFromCloudinary(imageUrl);
            }
        }

        if (CompanyLogo) {
            console.log("Debug: Deleting company logo");
            await deleteFromCloudinary(CompanyLogo);
        }

        if (uploadedKeyPeopleImages.length > 0) {
            console.log("Debug: Deleting keyPeople images");
            for (const imageUrl of uploadedKeyPeopleImages) {
                await deleteFromCloudinary(imageUrl);
            }
        }

        if (uploadedCLogos.length > 0) {
            console.log("Debug: Deleting companiesInvested logos");
            for (const imageUrl of uploadedCLogos) {
                await deleteFromCloudinary(imageUrl);
            }
        }

        if (!res.headersSent) {
            console.log("Debug: Sending error response");
            return res.status(500).json({
                message: "Internal Server Error" + error,
                error: error.message
            });
        }
    }
};

const updateInvestor = async (req, res) => {
    const uploadedImages = [];
    const uploadedKeyPeopleImages = [];
    const uploadedCLogos = [];
    let CompanyLogo = "";

    try {
        console.log(req.body)
        console.log("Debug: Starting updateInvestor function");
        const investorId = req.params.id;
        if (!isValidObjectId(investorId)) {
            return res.status(400).json({
                msg: "Invalid  investor objectId "
            });
        }

        const {
            companyName,
            companyGovtVerifiedNo,
            keyPeople,
            companiesInvested,
            briefInfo,
            contact,
            email,
            address,
            website,
            linkedIn
        } = req.body;

        // Fetch existing investor details
        const investor = await Investor.findById(investorId);
        if (!investor) {
            return res.status(404).json({
                message: "Investor not found"
            });
        }

        if (!req.files || !(req.body.companiesInvested.length == req.files.Clogos.length) || !(req.body.keyPeople.length == req.files.keyPeopleImages.length)) {
            console.log("Debug: File validation failed");
            return res.status(400).json({
                msg: "You have either not provided company logo for every company in which you have invested or image for every key person you have registered"
            });
        }

        // Validate required fields (similar validation as addInvestor)

        // Handle images upload
        if (req.files && req.files.images) {
            console.log("Debug: Starting images upload");
            for (const file of req.files.images) {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) {
                    uploadedImages.push(uploadResult.url);
                }
            }
            console.log("Debug: Images upload complete");
        }

        // Handle company logo upload
        if (req.files && req.files.logo && req.files.logo[0]) {
            console.log("Debug: Starting company logo upload");
            const uploadResult = await uploadOnCloudinary(req.files.logo[0].path);
            if (uploadResult) {
                CompanyLogo = uploadResult.url;
            }
            console.log("Debug: Company logo upload complete");
        }

        // Handle keyPeople image uploads
        if (req.files && req.files.keyPeopleImages) {
            console.log("Debug: Starting keyPeople images upload");
            for (const file of req.files.keyPeopleImages) {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) {
                    uploadedKeyPeopleImages.push(uploadResult.url);
                }
            }
            console.log("Debug: keyPeople images upload complete");
        }

        // Handle companiesInvested clogo uploads
        if (req.files && req.files.Clogos) {
            console.log("Debug: Starting companiesInvested logos upload");
            for (const file of req.files.Clogos) {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) {
                    uploadedCLogos.push(uploadResult.url);
                }
            }
            console.log("Debug: companiesInvested logos upload complete");
        }

        // Update the investor instance
        console.log("Debug: Updating Investor instance");
        investor.companyName = companyName;
        investor.companyGovtVerifiedNo = companyGovtVerifiedNo;
        investor.keyPeople = keyPeople.map(person => ({
            ...person,
            image: uploadedKeyPeopleImages.shift()
        }));
        investor.companiesInvested = companiesInvested.map(company => ({
            ...company,
            clogo: uploadedCLogos.shift()
        }));
        investor.briefInfo = briefInfo;
        investor.contact = contact;
        investor.email = email;
        investor.address = address;
        investor.website=website,
        investor.linkedIn=linkedIn,
        investor.images = uploadedImages.length ? uploadedImages : investor.images;
        investor.logo = CompanyLogo || investor.logo;

        // Save the updated investor to the database
        console.log("Debug: Saving updated investor to the database");
        const result = await investor.save();

        if (result) {
            console.log("Debug: Investor updated successfully");
            return res.status(200).json({
                message: "Investor updated successfully",
                investor: result
            });
        } else {
            console.log("Debug: Failed to update the investor");
            throw new Error("Failed to update the investor");
        }

    } catch (error) {
        console.log("Debug: An error occurred", error.message);
        // Delete uploaded images if any error occurs (similar deletion logic as addInvestor)
        if (uploadedImages.length > 0) {
            console.log("Debug: Deleting uploaded images");
            for (const imageUrl of uploadedImages) {
                await deleteFromCloudinary(imageUrl);
            }
        }

        if (CompanyLogo) {
            console.log("Debug: Deleting company logo");
            await deleteFromCloudinary(CompanyLogo);
        }

        if (uploadedKeyPeopleImages.length > 0) {
            console.log("Debug: Deleting keyPeople images");
            for (const imageUrl of uploadedKeyPeopleImages) {
                await deleteFromCloudinary(imageUrl);
            }
        }

        if (uploadedCLogos.length > 0) {
            console.log("Debug: Deleting companiesInvested logos");
            for (const imageUrl of uploadedCLogos) {
                await deleteFromCloudinary(imageUrl);
            }
        }

        if (!res.headersSent) {
            console.log("Debug: Sending error response+" + error);
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
};

const getAllInvestors = async (req, res) => {
    try {
        console.log("Debug: Fetching all investors with pagination");

        const {
            page = 1, limit = 10
        } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const investors = await Investor.find({})
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const total = await Investor.countDocuments({});

        return res.status(200).json({
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
            data: investors
        });
    } catch (error) {
        console.log("Debug: An error occurred", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const getInvestorById = async (req, res) => {
    try {
        const investorId = req.params.id;
        if (!isValidObjectId(investorId)) {
            return res.status(400).json({
                msg: "Invalid  investor objectId "
            });
        }

        console.log(`Debug: Fetching investor with ID: ${investorId}`);
        const investor = await Investor.findById(investorId);
        if (!investor) {
            return res.status(404).json({
                message: "Investor not found"
            });
        }
        return res.status(200).json(investor);
    } catch (error) {
        console.log("Debug: An error occurred", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const searchInvestors = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        console.log(`Debug: Searching investors with query: ${query}`);
        const investors = await Investor.find({
            $text: { $search: query }
        });

        return res.status(200).json(investors);
    } catch (error) {
        console.log("Debug: An error occurred during search", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const suggestInvestors = async (req, res) => {
    try {
        console.log("sadas")
        const { query } = req.query;
        const suggestions = await Investor.find({
            $text: { $search: query }
        }).limit(5); // Limit the number of suggestions returned

        return res.status(200).json({ suggestions });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getInvestorFromAdminId= async(req,res)=>{
    try {
        const {
            admin_id
        }=req.params

        result = await Investor.findOne({
            "admin_id":admin_id
        })
        if(! result){
            console.log('not found')
            return res.status(404).json({
                message: "No Investor Register",
            });

        }
        else{
            return res.status(200).json({
                result
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}


module.exports = {
    addInvestor,
    updateInvestor,
    getAllInvestors,
    getInvestorById,
    searchInvestors,
    suggestInvestors,
    getInvestorFromAdminId
}