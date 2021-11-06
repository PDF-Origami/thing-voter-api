import { Router } from 'express';
import setController from '../controllers/set.js';
import { query } from '../db-connect.js';

const router = Router();

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
