import pgPromise from 'pg-promise';

const pgp = pgPromise();

const db = pgp({
  password: process.env.PGPASSWORD,
});

// Verify connection
db.connect()
  .then(obj => {
    obj.done(); // success, release connection;
    console.log('Connected to DB');
  })
  .catch(e => {
    console.log('Unable to connect to DB:', e);
  });

export { db };
export const { QueryResultError } = pgp.errors;
