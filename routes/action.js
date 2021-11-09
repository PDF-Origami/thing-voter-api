import { Router } from 'express';
import * as actionController from '../controllers/action.js';
import { validateParameter } from '../utils/controllers.js';

const router = Router();

router.param('action_id', validateParameter);

router.route('/:action_id')
  .get(actionController.getOne);

export default router;
