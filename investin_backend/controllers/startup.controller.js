const Startup = require('../models/startups.model');
const getUserDetailFromToken = require('../services/getUserDetails');
const {
    uploadOnCloudinary,
    deleteFromCloudinary
} = require("../services/cloudinary");
const {
    isValidObjectId
} = require("../services/isValidObjectId")


const addStartup = async (req, res) => {
    const uploadedClientImages = [];
    const uploadedKeyPeopleImages = [];
    let CompanyLogo = "";
    try {
        console.log("Starting addStartup function..."); // Debugging

        const admin_id = req.cookies.id
        console.log("Admin ID:", admin_id); // Debugging

        if (!admin_id) {
            return res.status(400).json({
                msg: "Please login again"
            });
        }
        
        const {
            companyName,
            companyGovtVerifiedNo,
            email,
            keyPeople,
            companyInfo,
            shareholderPattern,
            domain,
            clients,
            pitch,
            contact,
            equityOffered,
            valuation,
            website,
            linkedIn,
            startupType="product",
            stage="seed",
            likes = 0
        } = req.body;

        console.log("Request Body:", req.body); // Debugging

        if (req.files && req.files.clientImages && clients && !(clients.length === req.files.clientImages.length)) {
            console.log("Client images validation failed..."); // Debugging
            return res.status(400).json({
                msg: "You have not provided images for every client"
            });
        }

        // Validate required fields
        if (!email || !companyInfo || !domain || !contact || !equityOffered || !valuation) {
            console.log("Required fields missing..."); // Debugging
            return res.status(400).json({
                message: "Please provide email, companyInfo, domain, contact, equityOffered, and valuation"
            });
        }

        // Validate keyPeople array
        if (keyPeople && keyPeople.length > 0) {
            for (let person of keyPeople) {
                const {
                    name,
                    position,
                    role,
                    info
                } = person;
                if (!name || !position || !role || !info) {
                    console.log("Key People validation failed:", person); // Debugging
                    return res.status(400).json({
                        message: "Each keyPeople object should have name, position, role, and info"
                    });
                }
            }
        }

        // Validate shareholderPattern array
        if (shareholderPattern && shareholderPattern.length > 0) {
            for (let pattern of shareholderPattern) {
                const {
                    investor,
                    holdingPercentage
                } = pattern;
                if (!investor || holdingPercentage === undefined) {
                    console.log("Shareholder Pattern validation failed:", pattern); // Debugging
                    return res.status(400).json({
                        message: "Each shareholderPattern object should have investor and holdingPercentage"
                    });
                }
            }
        }

        // Validate clients array
        if (clients && clients.length > 0) {
            for (let client of clients) {
                const {
                    clientName,
                    work,
                    info
                } = client;
                if (!clientName || !work || !info) {
                    console.log("Client validation failed:", client); // Debugging
                    return res.status(400).json({
                        message: "Each client object should have clientName, work, and info"
                    });
                }
            }
        }

        // Handle company logo upload
        if (req.files && req.files.logo && req.files.logo[0]) {
            console.log("Uploading Company Logo..."); // Debugging
            const uploadResult = await uploadOnCloudinary(req.files.logo[0].path);
            console.log("Upload Result for Logo:", uploadResult); // Debugging
            if (uploadResult) {
                CompanyLogo = uploadResult.url;
                console.log("Company Logo URL:", CompanyLogo); // Debugging
            }
        }

        // Handle keyPeople image uploads
        if (req.files && req.files.keyPeopleImages) {
            for (const file of req.files.keyPeopleImages) {
                console.log("Uploading Key People Image..."); // Debugging
                const uploadResult = await uploadOnCloudinary(file.path);
                console.log("Upload Result for Key People Image:", uploadResult); // Debugging
                if (uploadResult) {
                    uploadedKeyPeopleImages.push(uploadResult.url);
                    console.log("Uploaded Key People Image URL:", uploadResult.url); // Debugging
                }
            }
        }

        // Handle client images upload
        if (req.files && req.files.clientImages) {
            for (const file of req.files.clientImages) {
                console.log("Uploading Client Image..."); // Debugging
                const uploadResult = await uploadOnCloudinary(file.path);
                console.log("Upload Result for Client Image:", uploadResult); // Debugging
                if (uploadResult) {
                    uploadedClientImages.push(uploadResult.url);
                    console.log("Uploaded Client Image URL:", uploadResult.url); // Debugging
                }
            }
        }

        // Create a new Startup instance
        const startup = new Startup({
            companyName,
            companyGovtVerifiedNo,
            admin_id,
            logo: CompanyLogo,
            email,
            keyPeople: keyPeople ? keyPeople.map(person => ({
                ...person,
                image: uploadedKeyPeopleImages.shift()
            })) : [],
            companyInfo,
            shareholderPattern: shareholderPattern || [],
            domain,
            clients: clients ? clients.map(client => ({
                ...client,
                images: uploadedClientImages.shift()
            })) : [],
            pitch,
            contact,
            equityOffered,
            valuation,
            website,
            linkedIn,
            startupType,
            stage,
            likes
        });

        console.log("Startup Object:", startup); // Debugging

        // Save the startup to the database
        const result = await startup.save();
        console.log("Save Result:", result); // Debugging

        if (result) {
            return res.status(201).json({
                message: "Startup added successfully",
                startup: result
            });
        } else {
            throw new Error("Failed to save the startup");
        }

    } catch (error) {
        console.error("Error occurred:", error); // Debugging

        // Delete uploaded images if any error occurs
        if (uploadedClientImages.length > 0) {
            for (const imageUrl of uploadedClientImages) {
                console.log("Deleting Client Image:", imageUrl); // Debugging
                await deleteFromCloudinary(imageUrl);
            }
        }

        if (CompanyLogo) {
            console.log("Deleting Company Logo:", CompanyLogo); // Debugging
            await deleteFromCloudinary(CompanyLogo);
        }

        if (uploadedKeyPeopleImages.length > 0) {
            for (const imageUrl of uploadedKeyPeopleImages) {
                console.log("Deleting Key People Image:", imageUrl); // Debugging
                await deleteFromCloudinary(imageUrl);
            }
        }

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
};


const updateStartup = async (req, res) => {
    const uploadedClientImages = [];
    const uploadedKeyPeopleImages = [];
    let CompanyLogo = "";

    try {
        const {
            id
        } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                msg: "Invalid objectId"
            });
        }
        const admin_id = getUserDetailFromToken(req);

        if (!admin_id) {
            return res.status(400).json({
                msg: "Please login again"
            });
        }

        const {
            companyName,
            companyGovtVerifiedNo,
            email,
            keyPeople,
            companyInfo,
            shareholderPattern,
            domain,
            clients,
            interestedVC,
            pitch,
            contact,
            equityOffered,
            valuation,
            website,
            linkedIn,
            startupType,
            stage
        } = req.body;

        if (req.files && req.files.clientImages && clients && !(clients.length === req.files.clientImages.length)) {
            return res.status(400).json({
                msg: "You have not provided images for every client"
            });
        }

        // Validate keyPeople array
        if (keyPeople && keyPeople.length > 0) {
            for (let person of keyPeople) {
                const {
                    name,
                    position,
                    role,
                    info
                } = person;
                if (!name || !position || !role || !info) {
                    return res.status(400).json({
                        message: "Each keyPeople object should have name, position, role, and info"
                    });
                }
            }
        }

        // Validate shareholderPattern array
        if (shareholderPattern && shareholderPattern.length > 0) {
            for (let pattern of shareholderPattern) {
                const {
                    investor,
                    holdingPercentage
                } = pattern;
                if (!investor || holdingPercentage === undefined) {
                    return res.status(400).json({
                        message: "Each shareholderPattern object should have investor and holdingPercentage"
                    });
                }
            }
        }

        // Validate clients array
        if (clients && clients.length > 0) {
            for (let client of clients) {
                const {
                    clientName,
                    work,
                    info
                } = client;
                if (!clientName || !work || !info) {
                    return res.status(400).json({
                        message: "Each client object should have clientName, work, and info"
                    });
                }
            }
        }

        // Handle company logo upload
        if (req.files && req.files.logo && req.files.logo[0]) {
            const uploadResult = await uploadOnCloudinary(req.files.logo[0].path);
            if (uploadResult) {
                CompanyLogo = uploadResult.url;
            }
        }

        // Handle keyPeople image uploads
        if (req.files && req.files.keyPeopleImages) {
            for (const file of req.files.keyPeopleImages) {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) {
                    uploadedKeyPeopleImages.push(uploadResult.url);
                }
            }
        }

        // Handle client images upload
        if (req.files && req.files.clientImages) {
            for (const file of req.files.clientImages) {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) {
                    uploadedClientImages.push(uploadResult.url);
                }
            }
        }

        const updatedData = {
            companyName,
            companyGovtVerifiedNo,
            admin_id,
            logo: CompanyLogo || req.body.logo,
            email,
            keyPeople: keyPeople ? keyPeople.map(person => ({
                ...person,
                image: uploadedKeyPeopleImages.shift() || person.image
            })) : [],
            companyInfo,
            shareholderPattern: shareholderPattern || [],
            domain,
            clients: clients ? clients.map(client => ({
                ...client,
                images: uploadedClientImages.shift() || client.images
            })) : [],
            interestedVC: interestedVC || [],
            pitch,
            contact,
            equityOffered,
            valuation,
            website,
            linkedIn,
            startupType,
            stage
        };

        const updatedStartup = await Startup.findByIdAndUpdate(id, updatedData, {
            new: true
        });

        if (!updatedStartup) {
            return res.status(404).json({
                message: "Startup not found"
            });
        }

        res.status(200).json({
            message: "Startup updated successfully",
            startup: updatedStartup
        });

    } catch (error) {
        // Delete uploaded images if any error occurs
        if (uploadedClientImages.length > 0) {
            for (const imageUrl of uploadedClientImages) {
                await deleteFromCloudinary(imageUrl);
            }
        }

        if (CompanyLogo) {
            await deleteFromCloudinary(CompanyLogo);
        }

        if (uploadedKeyPeopleImages.length > 0) {
            for (const imageUrl of uploadedKeyPeopleImages) {
                await deleteFromCloudinary(imageUrl);
            }
        }

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
};

const deleteStartup = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                msg: "Invalid objectId"
            });
        }

        const admin_id = getUserDetailFromToken(req);

        if (!admin_id) {
            return res.status(400).json({
                msg: "Please login again"
            });
        }

        const startup = await Startup.findById(id);

        if (!startup) {
            return res.status(404).json({
                message: "Startup not found"
            });
        }

        await startup.deleteOne();

        res.status(200).json({
            message: "Startup deleted successfully"
        });

    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
};

const getStartupById = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                msg: "Invalid objectId"
            });
        }
        const startup = await Startup.findById(id);

        if (!startup) {
            return res.status(404).json({
                message: "Startup not found"
            });
        }

        return res.status(200).json(startup);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// const getAllStartup = async (req, res) => {
//     try {
//         const {
//             page = 1, limit = 10
//         } = req.query;
//         const pageNumber = parseInt(page);
//         const limitNumber = parseInt(limit);

//         const startup = await Startup.find({})
//             .skip((pageNumber - 1) * limitNumber)
//             .limit(limitNumber);

//         const total = await Startup.countDocuments({});

//         return res.status(200).json({
//             total,
//             page: pageNumber,
//             limit: limitNumber,
//             totalPages: Math.ceil(total / limitNumber),
//             data: startup
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// }

const getAllStartup = async (req, res) => {
    try {
        const {
            page = 1, 
            limit = 10, 
            search = '', 
            stage, 
            startupType, 
            minEquityOffered, 
            maxEquityOffered, 
            minValuation, 
            maxValuation
        } = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Construct the filter object
        const filter = {};
        
        if (search) {
            filter.companyName = { $regex: search, $options: 'i' }; // Case-insensitive search by company name
        }

        if (stage) {
            filter.stage = stage;
        }

        if (startupType) {
            filter.startupType = startupType;
        }

        if (minEquityOffered || maxEquityOffered) {
            filter.equityOffered = {};
            if (minEquityOffered) {
                filter.equityOffered.$gte = parseInt(minEquityOffered);
            }
            if (maxEquityOffered) {
                filter.equityOffered.$lte = parseInt(maxEquityOffered);
            }
        }

        if (minValuation || maxValuation) {
            filter.valuation = {};
            if (minValuation) {
                filter.valuation.$gte = parseInt(minValuation);
            }
            if (maxValuation) {
                filter.valuation.$lte = parseInt(maxValuation);
            }
        }

        // Query the database
        const startup = await Startup.find(filter)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const total = await Startup.countDocuments(filter);

        return res.status(200).json({
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
            data: startup
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


const getStartupFromAdminId= async(req,res)=>{
    try {
       

        const {
            admin_id
        }=req.params

        result = await Startup.findOne({
            "admin_id":admin_id
        })
        if(! result){
            console.log('not found')
            return res.status(404).json({
                message: "No Startup Register",
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
    addStartup,
 getStartupFromAdminId,
    updateStartup,
    deleteStartup,
    getStartupById,
    getAllStartup
};