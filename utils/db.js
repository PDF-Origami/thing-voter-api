import dotenv from 'dotenv';
import pgPromise from 'pg-promise';

dotenv.config();
const pgp = pgPromise();

export const db = pgp({
  password: process.env.PGPASSWORD,
});

export const { QueryResultError } = pgp.errors;
