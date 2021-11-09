import { Router } from 'express';
import * as entityController from '../controllers/entity.js';
import { validateParameter } from '../utils/controllers.js';

const router = Router();

router.param('entity_id', validateParameter);

router.route('/')
  .get(entityController.getAll)
  .post(entityController.createOne);

router.route('/:entity_id')
  .get(entityController.getOne);

export default router;
