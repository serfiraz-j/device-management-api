const pino = require('pino');
const pinoHttp = require('pino-http');
const { randomUUID } = require('node:crypto');

const logger = pino({
  level: 'info',

  redact: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
});

const requestLogger = pinoHttp({
  logger,

  genReqId(req, res) {
    const id = randomUUID();
    res.setHeader('X-Request-Id', id);
    return id;
  },

  customLogLevel(req, res, err) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});

module.exports = { logger, requestLogger };
