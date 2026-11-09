const express = require('express');

const deviceController = require('../controllers/deviceController');
const { createDeviceSchema } = require('../validators/deviceValidator');
const { updateDeviceSchema } = require('../validators/deviceValidator');

const validate = require('../middleware/validate');
const validateIdParam = require('../middleware/validateIdParam');

const router = express.Router();

router.get('/devices', deviceController.getDevices);

router.get('/devices/:id', validateIdParam, deviceController.getDeviceById);

router.post('/devices', validate(createDeviceSchema), deviceController.createDevice);

router.put(
  '/devices/:id',
  validateIdParam,
  validate(updateDeviceSchema),
  deviceController.updateDevice,
);

router.delete('/devices/:id', validateIdParam, deviceController.deleteDevice);

module.exports = router;
