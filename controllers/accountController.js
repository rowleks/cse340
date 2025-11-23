//Render the home view
const accountModel = require("../models/account-model");
const utils = require("../utilities");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Render login view
async function renderLogin(_, res) {
  const nav = await utils.buildNav();

  res.render("account/login", { title: "Login", nav, errors: null });
}

// Render sign-up view
async function renderSignUp(_, res) {
  const nav = await utils.buildNav();

  res.render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  });
}

async function renderAcctMgmt(_, res) {
  const nav = await utils.buildNav();
  res.render("account/management", {
    title: "Manage Account",
    nav,
    errors: null,
  });
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

async function accountLogin(req, res) {
  const nav = await utils.buildNav();

  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash(
      "error",
      "Incorrect username or password, please check your credentials and try again"
    );
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }

  try {
    const validUser = await bcrypt.compare(
      account_password,
      accountData.account_password
    );
    if (validUser) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });

      switch (process.env.NODE_ENV) {
        case "development":
          res.cookie("jwt", accessToken, {
            httpOnly: true,
            maxAge: 3600 * 1000,
          });
        default:
          res.cookie("jwt", accessToken, {
            httpOnly: true,
            maxAge: 3600 * 1000,
            secure: true,
          });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "error",
        "Incorrect username or password, please check your credentials and try again"
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (err) {
    throw new Error("Access Forbidden", err.message);
  }
}

module.exports = {
  renderLogin,
  renderSignUp,
  registerAccount,
  accountLogin,
  renderAcctMgmt,
};
