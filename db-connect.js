import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool();

export async function query(text, parameters) {
  // Todo - error handling, homie
  return pool.query(text, parameters);
}

export async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    try {
      await callback(client);
      client.query('COMMIT');
    } catch (e) {
      client.query('ROLLBACK');
    }
  } finally {
    client.release();
  }
}
