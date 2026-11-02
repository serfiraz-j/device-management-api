const deviceService = require('../services/deviceService');
const { createDeviceSchema } = require('../validators/deviceValidator');

async function getDevices(req, res) {
  const devices = await deviceService.listDevices();

  return res.status(200).json(devices);
}

async function getDeviceById(req, res) {
  const rawId = req.params.id;

  if (!/^[0-9]+$/.test(rawId)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_ID',
        message: 'ID pozitif bir tam sayi olmali',
        statusCode: 400,
      },
    });
  }

  const id = Number(rawId);

  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    return res.status(400).json({
      error: {
        code: 'INVALID_ID',
        message: 'ID pozitif bir tam sayi olmali',
        statusCode: 400,
      },
    });
  }

  const device = await deviceService.getDeviceById(id);

  if (device == null) {
    return res.status(404).json({
      error: {
        code: 'DEVICE_NOT_FOUND',
        message: 'Cihaz bulunamadı',
        statusCode: 404,
      },
    });
  }

  return res.status(200).json(device);
}

async function createDevice(req, res) {
  const result = createDeviceSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Gecersiz cihaz verisi',
        statusCode: 400,
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
  }

  const device = await deviceService.createDevice(result.data);

  res.location(`/devices/${device.id}`);

  return res.status(201).json(device);
}

module.exports = { getDevices, getDeviceById, createDevice };
