function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const isJsonError = err instanceof SyntaxError && err.status === 400 && 'body' in err;

  const statusCode = isJsonError ? 400 : 500;

  if (statusCode === 500) {
    req.log.error({ err }, 'Sunucu hatasi');
  }

  return res.status(statusCode).json({
    error: {
      code: isJsonError ? 'INVALID_JSON' : 'INTERNAL_ERROR',
      message: isJsonError ? 'Gecersiz JSON verisi' : 'Beklenmeyen sunucu hatasi',
      statusCode,
    },
  });
}

module.exports = errorHandler;
