const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require('./services/db_connection');
const userRoute = require('./routes/users.route');
const investorRoute = require('./routes/investor.route');
const startupRoute = require('./routes/startups.route');
const partnershipRoute = require('./routes/partnership.route');0
require("dotenv").config();
const cors = require('cors');

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200
}));


// Use middleware to parse JSON and URL-encoded data
app.use(express.json()); // Parses incoming JSON requests and puts the parsed data in req.body
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads

// Parse cookies
app.use(cookieParser()); 

// User route
app.use("/api/users", userRoute);
app.use("/api/investors", investorRoute);
app.use("/api/startups", startupRoute);
app.use("/api/partnerships", partnershipRoute);



// Connect to MongoDB
connectDB(process.env.MONGO_URL);

// Root endpoint
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Investsathi" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
 