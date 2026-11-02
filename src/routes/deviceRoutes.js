const express = require('express');

const deviceController = require('../controllers/deviceController');
const { createDeviceSchema } = require('../validators/deviceValidator');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/devices', deviceController.getDevices);

router.get('/devices/:id', deviceController.getDeviceById);

router.post('/devices', validate(createDeviceSchema), deviceController.createDevice);

module.exports = router;
