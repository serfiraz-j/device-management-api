const pool = require('../db/connection');

async function findAll() {
  const result = await pool.query('SELECT * FROM devices ORDER BY id ASC');

  return result.rows;
}

async function findById(id) {
  const result = await pool.query('SELECT * FROM devices WHERE id = $1', [id]);

  return result.rows[0] ?? null;
}

module.exports = { findAll, findById };
