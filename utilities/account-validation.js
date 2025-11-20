const utils = require("./index");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");

function registrationRules() {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters."),

    body("account_lastname")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters."),

    body("account_email")
      .trim()
      .escape()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 symbol."
      ),
  ];
}

function loginRules() {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Incorrect username or password"),

    body("account_email")
      .trim()
      .escape()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists) {
          throw new Error(
            "You currently do not have an account. Please sign up"
          );
        }
      }),
  ];
}

async function checkRegData(req, res, next) {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utils.buildNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
}
async function checkLoginData(req, res, next) {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utils.buildNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
}

module.exports = {
  registrationRules,
  checkRegData,
  checkLoginData,
  loginRules,
};
