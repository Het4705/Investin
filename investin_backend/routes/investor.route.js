const express = require('express');
const {
  checkAuthentication,
  checkRoleInvestor
} = require('../middlewares/auth');
const router = express.Router();
const {
  addInvestor,
  getAllInvestors,
  updateInvestor,
  getInvestorById,
  suggestInvestors,
  getInvestorFromAdminId
} = require('../controllers/investor.controller');
const {
  upload
} = require('../middlewares/multer');

// Route for suggestions
router.get('/suggestions', suggestInvestors);

router.post('/add', checkAuthentication, checkRoleInvestor, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'keyPeopleImages', maxCount: 10 },
  { name: 'Clogos', maxCount: 10 }
]), addInvestor);

router.get('/', getAllInvestors);

router.put('/:id', checkAuthentication, checkRoleInvestor, upload.fields([{
    name: 'logo',
    maxCount: 1
  },
  {
    name: 'images',
    maxCount: 10
  },
  {
    name: 'keyPeopleImages',
    maxCount: 10
  },
  {
    name: 'Clogos',
    maxCount: 10
  }
]), updateInvestor);

router.get('/:id', getInvestorById)
  .get('/investorOf/:admin_id', checkAuthentication, checkRoleInvestor, getInvestorFromAdminId);

module.exports = router;