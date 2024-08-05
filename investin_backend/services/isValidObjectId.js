const mongoose = require('mongoose');

/**
 * Utility function to check if a given ID is a valid MongoDB ObjectId
 * @param {string} id - The ID to check
 * @returns {boolean} - Returns true if the ID is a valid ObjectId, otherwise false
 */

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

module.exports = { isValidObjectId };
