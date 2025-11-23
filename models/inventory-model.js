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
    return [];
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
    return [];
  }
}

async function getInvById(id) {
  try {
    const queryText = "SELECT * FROM inventory WHERE inv_id = $1";
    const data = await db.query(queryText, [id]);
    return data.rows;
  } catch (err) {
    console.error("getInById error " + err);
    return [];
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

async function addInventory(
  classificationID,
  make,
  model,
  description,
  imgPath,
  imgTnPath,
  price,
  year,
  miles,
  color
) {
  try {
    const queryText =
      "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    const data = await db.query(queryText, [
      classificationID,
      make,
      model,
      description,
      imgPath,
      imgTnPath,
      price,
      year,
      miles,
      color,
    ]);
    return data.rowCount;
  } catch (error) {
    console.error("addInventory error " + error);
    return 0;
  }
}

async function updateInventory(
  invId,
  make,
  model,
  description,
  imgPath,
  imgTnPath,
  price,
  year,
  miles,
  color,
  classificationId
) {
  try {
    const queryText =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await db.query(queryText, [
      make,
      model,
      description,
      imgPath,
      imgTnPath,
      price,
      year,
      miles,
      color,
      classificationId,
      invId,
    ]);
    return data.rowCount;
  } catch (error) {
    console.error("updateInv error " + error);
    return 0;
  }
}

//export the models
module.exports = {
  getClassifications,
  getInvByClassId,
  getInvById,
  addClassification,
  checkExistingClassification,
  addInventory,
  updateInventory,
};
