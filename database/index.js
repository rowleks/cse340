const { Pool } = require("pg");
require("dotenv").config;

// Disable SSL for local testing
let pool;

switch (process.env.NODE_ENV) {
  case "development":
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    async function query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("executed query", { text });
        return res;
      } catch (error) {
        console.error("error in query", { text });
        throw error;
      }
    }

    module.exports = { query };
    break;

  default:
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    module.exports = pool;
}
