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

export async function createOne(req, res, next) {
  try {
    if (req.body.name === undefined) {
      res.status(400).json({ error: 'No name specified' });
      return;
    }

    await db.none(
      'INSERT INTO entity (name, description) VALUES ($1, $2)',
      [req.body.name, req.body.description],
    );
    res.status(201).end();
  } catch (error) {
    next(error);
  }
}
