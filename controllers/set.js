import query from '../db-connect.js';

async function getAll(req, res, next) {
  try {
    const queryResult = await query('SELECT * FROM set');
    res.status(200).json(queryResult.rows);
  } catch (error) {
    next(error);
  }
}

async function getOne(req, res, next) {
  try {
    const queryResult = await query(
      'SELECT * FROM set WHERE id = $1',
      [req.params.set_id],
    );
    res.status(200).json(queryResult.rows[0]);
  } catch (error) {
    next(error);
  }
}

async function createOne(req, res, next) {
  try {
    await query(
      'INSERT INTO set (name, description) VALUES ($1, $2)',
      [req.body.name, req.body.description],
    );
    res.status(201).end();
  } catch (error) {
    next(error);
  }
}

async function getEntities(req, res, next) {
  try {
    const queryResult = await query(
      `SELECT e.*, a.name AS action_name, s_e_a.score
      FROM entity e
      INNER JOIN set_entity s_e
      ON e.id = s_e.entity_id
      INNER JOIN set_entity_action s_e_a
      ON e.id = s_e_a.entity_id
      INNER JOIN action a
      ON s_e_a.action_id = a.id
      WHERE s_e.set_id = $1`,
      [req.params.set_id],
    );

    const entities = queryResult.rows.filter((row, index) => (
      queryResult.rows.findIndex(gfy => gfy.id === row.id) === index
    ));

    queryResult.rows.map(row => {
      const entity = entities.find(e => e.id === row.id);
      if (!('scores' in entity)) {
        entity.scores = {};
      }
      entity.scores[row.action_name] = row.score;
      return entity;
    });

    res.status(200).json(entities);
  } catch (error) {
    next(error);
  }
}

async function addEntity(req, res, next) {
  try {
    await query(
      `INSERT INTO set_entity
      VALUES ($1, $2)
      ON CONFLICT ON CONSTRAINT set_entity_pkey
      DO NOTHING`,
      [req.params.set_id, req.params.entity_id],
    );
    res.status(201).end();
  } catch (error) {
    next(error);
  }
}

async function removeEntity(req, res, next) {
  try {
    await query(
      'DELETE FROM set_entity WHERE set_id = $1 AND entity_id = $2',
      [req.params.set_id, req.params.entity_id],
    );
    res.status(200).end();
  } catch (error) {
    next(error);
  }
}

export default {
  getAll,
  getOne,
  createOne,
  getEntities,
  addEntity,
  removeEntity,
};
