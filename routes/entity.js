import { Router } from 'express';
import query from '../db-connect.js';

const router = Router();

router.get('/', (req, res) => {
  query('SELECT * FROM entity')
    .then((queryResult) => res.json(queryResult.rows));
});

export default router;
