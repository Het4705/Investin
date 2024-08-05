var express = require('express');
var router = express.Router();
const {register,verifyUserEmail,login} = require('../controllers/user.controller');

/* GET users listing. */
router.post('/login',login);
router.post('/register',register);
router.get('/verify/:token',verifyUserEmail);


module.exports = router;
