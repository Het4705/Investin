// routes/partnershipRoutes.js
const express = require('express');
const router = express.Router();
const {checkAuthentication} = require('../middlewares/auth');
const {
    pendingPartnership,
    acceptedPartnership,
    raisePartnership,
    acceptPartnership,
    deletePartnership,
    raisedPartnership,
    rejectPartnership,
    rejectedPartnership,
    investmentMade
} = require('../controllers/partnership.controller');

// Routes
router.get('/pending/:id', checkAuthentication, pendingPartnership);
router.get('/accepted/:id', checkAuthentication, acceptedPartnership);
router.post('/raise/:id', checkAuthentication, raisePartnership);
router.put('/accept/:id', checkAuthentication, acceptPartnership);
router.delete('/:id', checkAuthentication, deletePartnership);
router.get('/raised/:id', checkAuthentication, raisedPartnership);
router.put('/reject/:id', checkAuthentication, rejectPartnership);
router.get('/rejected/:id', checkAuthentication, rejectedPartnership);
router.get('/investmentMade', checkAuthentication, investmentMade);

module.exports = router;
