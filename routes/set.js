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
      `SELECT e.*, a.name AS action_name, s_e_a.score
      FROM entity e INNER JOIN set_entity s_e
      ON e.id = s_e.entity_id
      INNER JOIN set_entity_action s_e_a
      ON e.id = s_e_a.entity_id
      INNER JOIN action a
      ON s_e_a.action_id = a.id
      WHERE s_e.set_id = $1`,
      [req.params.set_id],
    ).then((queryResult) => {
      const entities = []
      for (const row of queryResult.rows) {
        if (entities.map(entity => entity.id).includes(row.id)) {
          // Add the action and its score to .scores
          const entity = entities.find(entity => entity.id === row.id);
          entity.scores[row.action_name] = row.score;
        } else {
          // Add .scores and delete unnecessary keys
          row.scores = { [row.action_name]: row.score }
          delete row.score;
          delete row.action_name;
          entities.push(row);
        }
      };
      res.json(entities);
    });
  });

router.route('/:set_id/entities/:entity_id')
  .put((req, res) => {
    query(
      `INSERT INTO set_entity
      VALUES ($1, $2)
      ON CONFLICT ON CONSTRAINT set_entity_pkey
      DO NOTHING`,
      [req.params.set_id, req.params.entity_id])
      .then(() => res.status(201).end())
      .catch((error) => {
        res.status(400).end();
        console.log(error);
      });
  })
  .delete((req, res) => {
    query('DELETE FROM set_entity WHERE set_id = $1 AND entity_id = $2', [req.params.set_id, req.params.entity_id])
      .then(() => res.status(204).end())
      .catch(() => res.status(400).end());
  });

router.post('/:set_id/entities/:entity_id/vote', (req, res) => {
  query(
    `UPDATE set_entity 
    SET score = score + 1 
    WHERE set_id = $1 AND entity_id = $2`,
    [req.params.set_id, req.params.entity_id],
  ).then((queryResult) => {
    res.json(queryResult.rows);
  });
});

export default router;
