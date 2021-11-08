import { Router } from 'express';
import setController from '../controllers/set.js';
import { validateParameter } from '../utils/controllers.js';

const router = Router();

router.param('set_id', validateParameter);
router.param('entity_id', validateParameter);
router.param('action_id', validateParameter);

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
