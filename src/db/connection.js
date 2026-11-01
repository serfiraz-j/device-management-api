
const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,

  // Aynı anda en fazla 10 bağlantı
  max: 10,
});

module.exports = pool;
