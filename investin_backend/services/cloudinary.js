const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require("dotenv").config();


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("Uploading to Cloudinary:", localFilePath);
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "invest sathi" // Specify the folder here
        });
        console.log("Upload Success:", response);
        fs.unlinkSync(localFilePath); // Delete the local file after uploading
        return response;
    } catch (error) {
        console.error("Upload Failed:", error);
        fs.unlinkSync(localFilePath); // Delete the local file even if there's an error
        throw error;
    }
};


const deleteFromCloudinary = async (url) => {
    try {
        // Extract the public ID from the URL
        const publicId = url.split('/').pop().split('.')[0];
        console.log(`Deleting image with public ID: ${publicId}`);

        // Delete the image using the public ID
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image: ${url}`);
    } catch (error) {
        console.error(`Error deleting image: ${url}`, error);
    }
};

module.exports = { uploadOnCloudinary,deleteFromCloudinary };
