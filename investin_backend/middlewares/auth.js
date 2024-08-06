const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkAuthentication = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
        return res.status(401).send('Authorization token missing');
    }

    try {
         
        const decoded = jwt.verify(token, process.env.JWT_SECRET_FOR_LOGIN);
         
        if (!decoded) {
            console.log("Login to access the token")
            return res.status(401).json({
                message: "Login to access the token"
            });
        }
        req.user = decoded; // Attach decoded token to request object for further use
        console.log("next")
        next();
    } catch (err) {
        console.error('JWT verification error:');
        return res.status(401).send('Invalid token');
    }
};

const checkRoleInvestor = (req, res, next) => {
    const token = req.cookies.token;
    const role = req.cookies.role;
    if (!token ) {
        return res.status(401).send('Authorization token missing');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_FOR_LOGIN);
        if (!decoded) {
            return res.status(401).json({
                details: "Login to access the token"
            });
        }
        if (role == "investor") {
            next();
        }
        else{
            return res.status(401).json({
                details: "Only Valid Investors are allowed"
            });
        }
    } catch (err) {
        console.error('JWT verification error:');
        return res.status(401).send('Invalid token');
    }
}


const checkRoleStartup = (req, res, next) => {
    const token = req.cookies.token;
    const role = req.cookies.role;
    if (!token ) {
        return res.status(401).send('Authorization token missing');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_FOR_LOGIN);
        if (!decoded) {
            return res.status(401).json({
                details: "Login to access the token"
            });
        }
        if (role == "founder") {
            next();
        }
        else{
            return res.status(401).json({
                details: "Only Valid Startups are allowed"
            });
        }
    } catch (err) {
        console.error('JWT verification error:');
        return res.status(401).send('Invalid token');
    }
}

module.exports = {
    checkAuthentication,checkRoleInvestor,checkRoleStartup
};