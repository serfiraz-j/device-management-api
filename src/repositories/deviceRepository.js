const pool = require('../db/connection');

async function findAll() {
  const result = await pool.query('SELECT * FROM devices ORDER BY id ASC');

  return result.rows;
}

async function findById(id) {
  const result = await pool.query('SELECT * FROM devices WHERE id = $1', [id]);

  return result.rows[0] ?? null;
}

async function create(device) {
  // SQL sorgusu: yeni satır ekle
  const sql = `
    INSERT INTO devices (
      name,
      serial_number,
      status,
      battery,
      last_seen
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    device.name,
    device.serialNumber,
    device.status,
    device.battery ?? null,
    device.lastSeen ?? null,
  ];

  const result = await pool.query(sql, values);

  return result.rows[0];
}

module.exports = { findAll, findById, create };
