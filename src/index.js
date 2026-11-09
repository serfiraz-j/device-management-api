const app = require('./app');
const config = require('./config');
const pool = require('./db/connection');
const { logger } = require('./middleware/requestLogger');

const server = app.listen(config.port, () => {
  logger.info({ port: config.port }, 'Sunucu baslatildi');
});

let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info({ signal }, 'Kapanis sinyali alindi');

  try {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });

    logger.info('HTTP sunucusu kapatildi');

    await pool.end();

    logger.info('PostgreSQL baglanti havuzu kapatildi');
    logger.info('Uygulama basariyla kapatildi');

    process.exitCode = 0;
  } catch (error) {
    logger.error({ err: error }, 'Kapanis sirasinda hata olustu');
    process.exitCode = 1;
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
