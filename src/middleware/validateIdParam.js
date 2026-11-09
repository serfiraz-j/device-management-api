const sendError = require('../utils/sendError');

function validateIdParam(req, res, next) {
  const rawId = req.params.id;

  if (!/^[0-9]+$/.test(rawId)) {
    return sendError(res, 400, 'INVALID_ID', 'ID pozitif bir tam sayi olmali');
  }

  const id = Number(rawId);

  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    return sendError(res, 400, 'INVALID_ID', 'ID pozitif bir tam sayi olmali');
  }

  res.locals.deviceId = id;

  return next();
}

module.exports = validateIdParam;
