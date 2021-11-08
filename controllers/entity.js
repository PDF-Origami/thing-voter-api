import { db } from '../utils/db.js';

export async function getAll(req, res, next) {
  try {
    const sets = await db.any('SELECT * FROM entity');
    res.status(200).json(sets);
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    res.status(200).json(req.entity);
  } catch (error) {
    next(error);
  }
}
