const app = require('./app');
const config = require('./config');
const { logger } = require('./middleware/requestLogger');

app.listen(config.port, () => {
  logger.info({ port: config.port }, 'Sunucu baslatildi');
});
