import { db, QueryResultError } from './db.js';

// Check that the thing (set, entity or action) with the given id exists,
// then cache it in req
async function validateParameter(req, res, next, id, parameter) {
  const table = parameter.slice(0, -3);
  try {
    req[table] = await db.one(
      'SELECT * FROM $1:name WHERE id = $2',
      [table, id],
    );
    next();
  } catch (error) {
    if (error instanceof QueryResultError) {
      res.status(404).json({ error: `${table} not found` });
    } else {
      next(error);
    }
  }
}

export { validateParameter };
