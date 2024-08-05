const jwt = require('jsonwebtoken');
require('dotenv').config();

const getUserDetailFromToken = (req,res) => {


    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    if (!token) {
        res.status(401).send('Authorization token missing');
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.data; // Return the user_Id from the decoded token
    } catch (err) {
        res.status(401).send('Invalid token');
        return null;
    }
};

module.exports = getUserDetailFromToken;