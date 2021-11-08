import { Router } from 'express';
import setController from '../controllers/set.js';

const router = Router();

router.param('set_id', setController.validateParameter);
router.param('entity_id', setController.validateParameter);
router.param('action_id', setController.validateParameter);

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

router.route('/:set_id/entities/:entity_id/vote/:action_id')
  .put(setController.vote);

router.route('/:set_id/actions')
  .get(setController.getActions);

router.route('/:set_id/actions/:action_id')
  .put(setController.addAction)
  .delete(setController.removeAction);

export default router;
