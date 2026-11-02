const deviceService = require('../services/deviceService');

async function getDevices(req, res) {
  const devices = await deviceService.listDevices();

  return res.status(200).json(devices);
}

module.exports = { getDevices };
