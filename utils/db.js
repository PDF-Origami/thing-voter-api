import dotenv from 'dotenv';
import pgPromise from 'pg-promise';

dotenv.config();
const pgp = pgPromise();

export const db = pgp({
  password: process.env.PGPASSWORD,
});

db.connect()
  .then(obj => {
    obj.done(); // success, release connection;
  })
  .catch(() => {
    console.log('Unable to connect to DB');
  });

export const { QueryResultError } = pgp.errors;
