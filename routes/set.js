import { Router } from 'express';
import query from '../db-connect.js';

const router = Router();

router.get('/', (req, res) => {
  query('SELECT * FROM set')
    .then((queryResult) => res.json(queryResult.rows));
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

export default router;
