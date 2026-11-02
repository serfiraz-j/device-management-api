const express = require('express');
const deviceController = require('../controllers/deviceController');

const router = express.Router();

router.get('/devices', deviceController.getDevices);

module.exports = router;
