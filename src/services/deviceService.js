const deviceRepository = require('../repositories/deviceRepository');

function toDeviceDTO(device) {
  return {
    id: device.id,
    name: device.name,
    serialNumber: device.serial_number,
    status: device.status,
    battery: device.battery,
    lastSeen: device.last_seen,
    createdAt: device.created_at,
    updatedAt: device.updated_at,
  };
}

async function listDevices() {
  const devices = await deviceRepository.findAll();

  return devices.map(toDeviceDTO);
}

async function getDeviceById(id) {
  const device = await deviceRepository.findById(id);

  if (!device) {
    return null;
  }

  return toDeviceDTO(device);
}

module.exports = { listDevices, getDeviceById };
