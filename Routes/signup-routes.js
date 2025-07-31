const express = require('express');
const router = express.Router();
const signUpController = require('../Controller/signup-controller');

router.post('/signup', signUpController);
module.exports = router;