require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool();

module.exports = {
  async query(text, parameters) {
    return pool.query(text, parameters);
  },
};
