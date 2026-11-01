
const pool = require('../db/connection');

async function findAll() {
  const result = await pool.query(
    'SELECT * FROM devices ORDER BY id ASC'
  );

  return result.rows;
}

module.exports = { findAll };
