const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/authentication');
const {getProfile, updateProfile} = require('../Controller/user-controller');

router.get('/getprofile',verifyToken,getProfile);
router.post('/updatemyprofile', verifyToken, updateProfile);
module.exports = router;