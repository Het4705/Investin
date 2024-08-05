const express = require('express');
const router = express.Router();
const {
    raisePartnership,
    acceptPartnership,
    deletePartnership,
    investmentMade
} = require('../controllers/partnership.controller');
const {
    checkAuthentication
} = require('../middlewares/auth');

router.get("/",investmentMade)

router.post('/raise/:id', checkAuthentication, raisePartnership);


router.post('/accept/:id', checkAuthentication, acceptPartnership);


router.delete('/delete/:id', checkAuthentication, deletePartnership);

module.exports = router;