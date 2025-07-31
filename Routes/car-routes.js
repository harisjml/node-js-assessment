const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/authentication');
const {getCarList} = require('../Controller/car-controller');

router.get('/getcarlist',verifyToken, getCarList);
module.exports = router;
