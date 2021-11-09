import { db } from '../utils/db.js';

export async function getOne(req, res, next) {
  try {
    res.status(200).json(req.action);
  } catch (error) {
    next(error);
  }
}
