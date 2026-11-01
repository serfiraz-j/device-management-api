const express = require('express');
const { requestLogger } = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(requestLogger);

app.use(express.json());

app.use((req, res) => {
  return res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint bulunamadi',
      statusCode: 404,
    },
  });
});

app.use(errorHandler);

module.exports = app;
