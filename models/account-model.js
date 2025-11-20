const db = require("../database/");

//Store new account info on db
async function storeNewAccount(firstname, lastname, email, password) {
  try {
    const queryText =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *";
    const data = await db.query(queryText, [
      firstname,
      lastname,
      email,
      password,
    ]);
    return data;
  } catch (error) {
    return error.message;
  }
}

async function checkExistingEmail(email) {
  try {
    const queryText = "SELECT * FROM account WHERE account_email = $1";
    const emailList = await db.query(queryText, [email]);
    return emailList.rowCount;
  } catch (error) {
    return error.message;
  }
}

module.exports = { storeNewAccount, checkExistingEmail };
