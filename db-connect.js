import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool();

export default async function query(text, parameters) {
  return pool.query(text, parameters);
}
