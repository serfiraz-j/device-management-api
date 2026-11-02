function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.code === '23505' && err.constraint === 'devices_serial_number_key') {
    req.log.warn({ code: err.code }, 'Tekrarlanan seri numarasi');

    return res.status(409).json({
      error: {
        code: 'DUPLICATE_SERIAL_NUMBER',
        message: 'Bu seri numarasi zaten kullaniliyor',
        statusCode: 409,
      },
    });
  }

  const isJsonError = err instanceof SyntaxError && err.status === 400 && 'body' in err;

  if (isJsonError) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Gecersiz JSON verisi',
        statusCode: 400,
      },
    });
  }

  req.log.error({ err }, 'Sunucu hatasi');

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Beklenmeyen sunucu hatasi',
      statusCode: 500,
    },
  });
}

module.exports = errorHandler;
