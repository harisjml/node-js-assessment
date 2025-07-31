const express = require('express');
const router = express.Router();
const logOutController = require('../Controller/logout-controller');
const verifyToken = require('../Middleware/authentication');

router.post('/logout', verifyToken, logOutController);

module.exports = router;