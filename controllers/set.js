import { db, QueryResultError } from '../utils/db.js';

// Todo: factor out common code in addEntity, addAction, removeEntity, removeAction

async function getAll(req, res, next) {
  try {
    const sets = await db.any('SELECT * FROM set');
    res.status(200).json(sets);
  } catch (error) {
    next(error);
  }
}

async function getOne(req, res, next) {
  try {
    const set = await db.one(
      'SELECT * FROM set WHERE id = $1',
      [req.params.set_id],
    );

    res.status(200).json(set);
  } catch (error) {
    if (error instanceof QueryResultError) {
      res.status(404).json({ error: 'Set not found' });
    } else {
      next(error);
    }
  }
}

async function createOne(req, res, next) {
  try {
    await db.none(
      'INSERT INTO set (name, description) VALUES ($1, $2)',
      [req.body.name, req.body.description],
    );
    res.status(201).end();
  } catch (error) {
    next(error);
  }
}

async function getEntities(req, res, next) {
  /**
   * This is doable in one query, but it takes like 3 joins
   * and the resulting code is ugly and hard to read/understand.
   * The performance gains (~30%?) are not worth it.
   */
  try {
    const result = await db.task(async t => {
      const entities = await t.any(
        `SELECT e.* FROM entity e
        INNER JOIN set_entity s_e
        ON e.id = s_e.entity_id
        WHERE s_e.set_id = $1`,
        [req.params.set_id],
      );

      const actions = await t.any(
        `SELECT a.* FROM action a
        INNER JOIN set_action s_a
        ON a.id = s_a.action_id
        WHERE s_a.set_id = $1`,
        [req.params.set_id],
      );

      const combinations = await t.any(
        `SELECT * FROM set_entity_action
        WHERE set_id = $1`,
        [req.params.set_id],
      );
      /**
       * Copy the entity object and add an actions sub-object.
       * Each action id and name comes from set_action
       * and the score comes from set_entity_action.
       */
      return entities.map(entity => ({
        ...entity,
        actions: actions.map(action => ({
          id: action.id,
          name: action.name,
          score: combinations.find(
            c => c.entity_id === entity.id
              && c.action_id === action.id,
          ).score,
        })),
      }));
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function addEntity(req, res, next) {
  try {
    await db.tx(async t => {
      const setEntityInsert = await t.result(
        `INSERT INTO set_entity
        VALUES ($1, $2)
        ON CONFLICT ON CONSTRAINT set_entity_pkey
        DO NOTHING RETURNING *`,
        [req.params.set_id, req.params.entity_id],
      );

      // If entity was already in set, stop
      if (setEntityInsert.rowCount === 0) {
        return;
      }

      const setActions = await t.any(
        `SELECT action_id
        FROM set_action
        WHERE set_id = $1`,
        [req.params.set_id],
        setAction => setAction.action_id,
      );

      setActions.forEach(async action => {
        await t.none(
          `INSERT INTO set_entity_action
          VALUES ($1, $2, $3)`,
          [req.params.set_id, req.params.entity_id, action.action_id],
        );
      });
    });

    res.status(201).end();
  } catch (error) {
    next(error);
  }
}

async function removeEntity(req, res, next) {
  try {
    await db.tx(async t => {
      await t.none(
        `DELETE FROM set_entity
        WHERE set_id = $1 AND entity_id = $2`,
        [req.params.set_id, req.params.entity_id],
      );

      const setActions = await t.any(
        `SELECT action_id
        FROM set_action
        WHERE set_id = $1`,
        [req.params.set_id],
        setAction => setAction.action_id,
      );

      setActions.forEach(async action => {
        await t.none(
          `DELETE FROM set_entity_action
          WHERE set_id = $1 AND entity_id = $2 AND action_id = $3`,
          [req.params.set_id, req.params.entity_id, action.action_id],
        );
      });
    });
    res.status(200).end();
  } catch (error) {
    next(error);
  }
}

async function getActions(req, res, next) {
  try {
    const actions = await db.any(
      `SELECT action.* FROM action
      INNER JOIN set_action
      ON action.id = set_action.action_id
      WHERE set_id = $1`,
      [req.params.set_id],
    );
    res.status(200).json(actions);
  } catch (error) {
    next(error);
  }
}

async function addAction(req, res, next) {
  try {
    await db.tx(async t => {
      const setActionInsert = await t.result(
        `INSERT INTO set_action
        VALUES ($1, $2)
        ON CONFLICT ON CONSTRAINT set_action_pkey
        DO NOTHING RETURNING *`,
        [req.params.set_id, req.params.action_id],
      );

      // If action was already in set, stop
      if (setActionInsert.rowCount === 0) {
        return;
      }

      const setEntities = await t.any(
        `SELECT entity_id
        FROM set_entity
        WHERE set_id = $1`,
        [req.params.set_id],
        setEntity => setEntity.entity_id,
      );

      setEntities.forEach(async entity => {
        await t.none(
          `INSERT INTO set_entity_action
          VALUES ($1, $2, $3)`,
          [req.params.set_id, entity.entity_id, req.params.action_id],
        );
      });
    });

    res.status(201).end();
  } catch (error) {
    next(error);
  }
}

async function removeAction(req, res, next) {
  try {
    await db.tx(async t => {
      await t.none(
        `DELETE FROM set_action
        WHERE set_id = $1 AND action_id = $2`,
        [req.params.set_id, req.params.action_id],
      );

      const setEntities = await t.any(
        `SELECT entity_id
        FROM set_entity
        WHERE set_id = $1`,
        [req.params.set_id],
        setEntity => setEntity.entity_id,
      );

      setEntities.forEach(async entity => {
        await t.none(
          `DELETE FROM set_entity_action
          WHERE set_id = $1 AND entity_id = $2 AND action_id = $3`,
          [req.params.set_id, entity.entity_id, req.params.action_id],
        );
      });
    });
    res.status(200).end();
  } catch (error) {
    next(error);
  }
}

async function vote(req, res, next) {
  try {
    await db.one(
      `UPDATE set_entity_action
      SET score = score + 1
      WHERE set_id = $1 AND entity_id = $2 AND action_id = $3
      RETURNING set_id`,
      [req.params.set_id, req.params.entity_id, req.params.action_id],
    );
    res.status(200).end();
  } catch (error) {
    if (error instanceof QueryResultError) {
      res.status(404).json({ error: '(set, entity, action) combination not found' });
    } else {
      next(error);
    }
  }
}

export default {
  getAll,
  getOne,
  createOne,
  getEntities,
  addEntity,
  removeEntity,
  getActions,
  addAction,
  removeAction,
  vote,
};
