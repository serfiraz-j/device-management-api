const deviceService = require('../services/deviceService');
const sendError = require('../utils/sendError');

async function getDevices(req, res) {
  const devices = await deviceService.listDevices();

  return res.status(200).json(devices);
}

async function getDeviceById(req, res) {
  const id = res.locals.deviceId;

  const device = await deviceService.getDeviceById(id);

  if (device == null) {
    return sendError(res, 404, 'DEVICE_NOT_FOUND', 'Cihaz bulunamadı');
  }

  return res.status(200).json(device);
}

async function createDevice(req, res) {
  const device = await deviceService.createDevice(req.body);

  res.location(`/devices/${device.id}`);

  return res.status(201).json(device);
}

async function updateDevice(req, res) {
  const id = res.locals.deviceId;

  const device = await deviceService.updateDevice(id, req.body);

  if (device === null) {
    return sendError(res, 404, 'DEVICE_NOT_FOUND', 'Cihaz bulunamadı');
  }

  return res.status(200).json(device);
}

async function deleteDevice(req, res) {
  const id = res.locals.deviceId;

  const deleted = await deviceService.deleteDevice(id);

  if (!deleted) {
    return sendError(res, 404, 'DEVICE_NOT_FOUND', 'Cihaz bulunamadı');
  }

  return res.status(204).send();
}

module.exports = {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
};
