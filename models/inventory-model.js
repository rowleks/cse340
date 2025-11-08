const db = require("../database/");

// Get all classification and return an array of the data
async function getClassifications() {
  try {
    const data = await db.query(
      "SELECT * FROM classification ORDER BY classification_name"
    );
    return data.rows;
  } catch (err) {
    console.error("getClassifications error " + err);
  }
}

// Get classifications by id and return an array of the data
async function getInvByClassId(classification_id) {
  try {
    const queryText =
      "SELECT * FROM inventory i JOIN classification c ON i.classification_id = c.classification_id WHERE i.classification_id = $1";
    const data = await db.query(queryText, [classification_id]);
    return data.rows;
  } catch (err) {
    console.error("getClassificationsById error " + err);
  }
}

async function getInvById(id) {
  try {
    const queryText = "SELECT * FROM inventory WHERE inv_id = $1";
    const data = await db.query(queryText, [id]);
    return data.rows;
  } catch (err) {
    console.error("getInById error " + err);
  }
}

//export the models
module.exports = { getClassifications, getInvByClassId, getInvById };
