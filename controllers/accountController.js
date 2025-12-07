//Render the home view
const accountModel = require("../models/account-model");
const utils = require("../utilities");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Render login view
async function renderLogin(_, res) {
  if (res.locals.loggedIn) {
    if (
      res.locals.accountData &&
      res.locals.accountData.account_type !== "Client"
    ) {
      return res.redirect("/account/");
    }
    return res.redirect("/");
  }
  const nav = await utils.buildNav();

  return res.render("account/login", { title: "Login", nav, errors: null });
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
    hashedPassword,
  );

  if (regResult) {
    req.flash(
      "success",
      `Congratulations! You're registered ${account_firstname}. Please Login`,
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
      "Incorrect username or password, please check your credentials and try again",
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
      accountData.account_password,
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
          break;
        default:
          res.cookie("jwt", accessToken, {
            httpOnly: true,
            maxAge: 3600 * 1000,
            secure: true,
          });
      }
      // Redirect based on account type to avoid hitting the
      // `/account/` route for regular clients (which would set an
      // authorization flash and bounce back to login).
      if (
        accountData &&
        accountData.account_type &&
        accountData.account_type !== "Client"
      ) {
        return res.redirect("/account/");
      }
      return res.redirect("/");
    } else {
      req.flash(
        "error",
        "Incorrect username or password, please check your credentials and try again",
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
      return;
    }
  } catch (err) {
    throw new Error("Access Forbidden", err.message);
  }
}

async function accountLogout(_, res) {
  res.clearCookie("jwt");
  res.locals.loggedIn = false;
  res.redirect("/");
}

// Render the account update view
async function renderUpdateAccount(req, res) {
  try {
    const accountId = req.params.account_id;
    const accountData = await accountModel.getAccountById(accountId);

    if (!accountData || accountData instanceof Error) {
      req.flash("error", "Account not found");
      return res.redirect("/account/");
    }

    // Ensure the logged-in user can only update their own account
    if (res.locals.accountData.account_id !== parseInt(accountId)) {
      req.flash("error", "You are not authorized to update this account");
      return res.redirect("/account/");
    }

    const nav = await utils.buildNav();

    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      formData: {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      },
    });
  } catch (error) {
    req.flash("error", "Error loading account update page");
    res.redirect("/account/");
  }
}

// Update account information
async function updateAccountInfo(req, res) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } =
      req.body;

    if (res.locals.accountData.account_id !== parseInt(account_id)) {
      req.flash("error", "You are not authorized to update this account");
      return res.redirect("/account/");
    }

    const updatedAccount = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    );

    if (updatedAccount instanceof Error) {
      throw updatedAccount;
    }

    const accountData = await accountModel.getAccountById(account_id);
    delete accountData.account_password;
    const accessToken = jwt.sign(accountData, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        maxAge: 3600 * 1000,
      });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }

    req.flash("success", "Account information updated successfully");
    res.redirect("/account/");
  } catch (error) {
    console.error("Update account error:", error);
    req.flash("error", "Error updating account information");
    res.redirect(`/account/update/${req.body.account_id}`);
  }
}

// Change account password
async function changePassword(req, res) {
  try {
    const { account_id, account_password } = req.body;

    if (res.locals.accountData.account_id !== parseInt(account_id)) {
      req.flash("error", "You are not authorized to update this account");
      return res.redirect("/account/");
    }

    const hashedPassword = await bcrypt.hash(account_password, 10);

    const result = await accountModel.updatePassword(
      account_id,
      hashedPassword,
    );

    if (result instanceof Error) {
      throw result;
    }

    req.flash("success", "Password updated successfully");
    res.redirect(`/account/update/${account_id}`);
  } catch (error) {
    console.error("Change password error:", error);
    req.flash("error", "Error changing password");
    res.redirect(`/account/update/${req.body.account_id}`);
  }
}

module.exports = {
  renderLogin,
  renderSignUp,
  registerAccount,
  accountLogin,
  renderAcctMgmt,
  accountLogout,
  renderUpdateAccount,
  updateAccountInfo,
  changePassword,
};
