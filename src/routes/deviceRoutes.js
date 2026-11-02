const express = require('express');
const deviceController = require('../controllers/deviceController');

const router = express.Router();

router.get('/devices', deviceController.getDevices);

router.get('/devices/:id', deviceController.getDeviceById);

module.exports = router;
