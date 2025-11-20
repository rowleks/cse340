//Render the home view
const accountModel = require("../models/account-model");
const utils = require("../utilities");
const bcrypt = require("bcryptjs");

// Render login view
async function renderLogin(_, res) {
  const nav = await utils.buildNav();

  res.render("account/login", { title: "Login", nav, errors: null });
}

// Render sign-up view
async function renderSignUp(_, res) {
  const nav = await utils.buildNav();

  res.render("account/register", { title: "Registration", nav, errors: null });
}

//Register an account
async function registerAccount(req, res) {
  const nav = await utils.buildNav();

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("error", "Sorry, something went wrong. Kindly try again");

    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  const regResult = await accountModel.storeNewAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "success",
      `Congratulations! You're registered ${account_firstname}. Please Login`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("error", "Sorry, something went wrong. Kindly try again");

    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

module.exports = { renderLogin, renderSignUp, registerAccount };
