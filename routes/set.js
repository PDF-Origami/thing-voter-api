import { Router } from 'express';
import setController from '../controllers/set.js';
import query from '../db-connect.js';

const router = Router();

router.param('set_id', (req, res, next, id) => {
  query('SELECT * FROM set WHERE id = $1', [id])
    .then(queryResult => {
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
    .then(queryResult => {
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
  .get(setController.getAll)
  .post(setController.createOne);

router.route('/:set_id')
  .get(setController.getOne);

router.route('/:set_id/entities')
  .get(setController.getEntities);

router.route('/:set_id/entities/:entity_id')
  .put(setController.addEntity)
  .delete(setController.removeEntity);

router.post('/:set_id/entities/:entity_id/vote', (req, res) => {
  query(
    `UPDATE set_entity 
    SET score = score + 1 
    WHERE set_id = $1 AND entity_id = $2`,
    [req.params.set_id, req.params.entity_id],
  ).then(queryResult => {
    res.json(queryResult.rows);
  });
});

export default router;
