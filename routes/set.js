import { Router } from 'express';
import query from '../db-connect.js';

const router = Router();

router.param('set_id', (req, res, next, id) => {
  query('SELECT * FROM set WHERE id = $1', [id])
    .then((queryResult) => {
      if (queryResult.rowCount === 0) {
        res.sendStatus(404);
      } else {
        [req.set] = queryResult.rows;
        next();
      }
    })
    .catch(() => next(new Error('Failed to find set')));
});

router.param('entity_id', (req, res, next, id) => {
  query('SELECT * FROM entity WHERE id = $1', [id])
    .then((queryResult) => {
      if (queryResult.rowCount === 0) {
        res.sendStatus(404);
      } else {
        [req.entity] = queryResult.rows;
        next();
      }
    })
    .catch(() => next(new Error('Failed to find entity')));
});

router.route('/')
  .get((req, res) => {
    query('SELECT * FROM set')
      .then((queryResult) => res.json(queryResult.rows));
  })
  .post((req, res) => {
    query('INSERT INTO set (name, description) VALUES ($1, $2)', [req.body.name, req.body.description])
      .then(() => res.status(201).end());
  });

router.get('/:set_id', (req, res) => {
  query('SELECT * FROM set WHERE id = $1', [req.params.set_id])
    .then((queryResult) => {
      res.json(queryResult.rows[0]);
    });
});

router.route('/:set_id/entities')
  .get((req, res) => {
    query(
      `SELECT entity.*, set_contains_entity.score
      FROM entity INNER JOIN set_contains_entity 
      ON entity.id = set_contains_entity.entity_id
      WHERE set_contains_entity.set_id = $1`,
      [req.params.set_id],
    ).then((queryResult) => {
      res.json(queryResult.rows);
    });
  });

router.route('/:set_id/entities/:entity_id')
  .put((req, res) => {
    query('INSERT INTO set_contains_entity VALUES ($1, $2)', [req.params.set_id, req.params.entity_id])
      .then(() => res.status(201).end())
      .catch(() => res.status(400).end());
  })
  .delete((req, res) => {
    query('DELETE FROM set_contains_entity WHERE set_id = $1 AND entity_id = $2', [req.params.set_id, req.params.entity_id])
      .then(() => res.status(204).end())
      .catch(() => res.status(400).end());
  });

router.post('/:set_id/entities/:entity_id/vote', (req, res) => {
  query(
    `UPDATE set_contains_entity 
    SET score = score + 1 
    WHERE set_id = $1 AND entity_id = $2`,
    [req.params.set_id, req.params.entity_id],
  ).then((queryResult) => {
    res.json(queryResult.rows);
  });
});

export default router;
