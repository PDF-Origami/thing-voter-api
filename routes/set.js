import { Router } from 'express';
import query from '../db-connect.js';

const router = Router();

router.route('/')
  .get((req, res) => {
    query('SELECT * FROM set')
      .then((queryResult) => res.json(queryResult.rows));
  })
  .post((req, res) => {
    query('INSERT INTO set (name, description) VALUES ($1, $2)', [req.body.name, req.body.description])
      .then(() => res.status(201).end());
  });

router.get('/:id', (req, res) => {
  query('SELECT * FROM set WHERE id = $1', [req.params.id])
    .then((queryResult) => {
      if (queryResult.rowCount === 0) {
        res.status(404).json({ error: 'Set not found.' });
      }
      res.json(queryResult.rows[0]);
    });
});

router.route('/:id/entities')
  .get((req, res) => {
    query(
      `SELECT entity.* 
      FROM entity INNER JOIN set_contains_entity 
      ON entity.id = set_contains_entity.entity_id
      WHERE set_contains_entity.set_id = $1`,
      [req.params.id],
    )
      .then((queryResult) => {
        res.json(queryResult.rows);
      });
  });

export default router;
