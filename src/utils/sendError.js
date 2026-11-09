function sendError(res, status, code, message) {
  return res.status(status).json({
    error: {
      code: code,
      message: message,
      statusCode: status,
    },
  });
}

module.exports = sendError;
