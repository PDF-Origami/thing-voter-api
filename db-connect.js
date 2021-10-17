import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool();

export default async function query(text, parameters) {
  return pool.query(text, parameters);
}
