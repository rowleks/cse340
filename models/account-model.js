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

async function getAccountByEmail(email) {
  try {
    const result = await db.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

async function getAccountById(accountId) {
  try {
    const result = await db.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
      [accountId]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching account found");
  }
}

async function updateAccount(accountId, firstName, lastName, email) {
  try {
    const result = await db.query(
      `UPDATE account 
       SET account_firstname = $1, 
           account_lastname = $2, 
           account_email = $3 
       WHERE account_id = $4 
       RETURNING account_id, account_firstname, account_lastname, account_email, account_type`,
      [firstName, lastName, email, accountId]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("Error updating account information");
  }
}

async function updatePassword(accountId, hashedPassword) {
  try {
    const result = await db.query(
      `UPDATE account 
       SET account_password = $1 
       WHERE account_id = $2 
       RETURNING account_id`,
      [hashedPassword, accountId]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("Error updating password");
  }
}

module.exports = {
  storeNewAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
};
