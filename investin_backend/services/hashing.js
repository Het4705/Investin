const bcrypt = require('bcrypt');

const hashPassword = async (plainText) => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10; // Default to 10 if not provided
    return await bcrypt.hash(plainText, saltRounds);
};

const comparePassword = async (plainText, hashedText) => {
    return await bcrypt.compare(plainText, hashedText);
};

module.exports = { hashPassword, comparePassword };
