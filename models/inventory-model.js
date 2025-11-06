const db = require("../database/");

// Get all classification data
async function getClassifications() {
  return await db.query(
    "SELECT * FROM classification ORDER BY classification_name"
  );
}

module.exports = { getClassifications };
