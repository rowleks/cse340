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

async function addClassification(name) {
  try {
    const queryText =
      "INSERT INTO classification(classification_name) VALUES ($1) RETURNING *";
    const data = await db.query(queryText, [name]);
    return data.rowCount;
  } catch (err) {
    console.error("addClassification error " + err);
    return err.message;
  }
}

async function checkExistingClassification(name) {
  try {
    const query = "SELECT * FROM classification WHERE classification_name = $1";
    const result = await db.query(query, [name]);
    return result.rowCount;
  } catch (error) {
    return error.message;
  }
}

//export the models
module.exports = {
  getClassifications,
  getInvByClassId,
  getInvById,
  addClassification,
  checkExistingClassification,
};
