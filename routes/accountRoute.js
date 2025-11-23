const express = require("express");
const utils = require("../utilities");
const {
  renderLogin,
  renderSignUp,
  registerAccount,
  accountLogin,
  renderAcctMgmt,
} = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const router = express.Router();

router.get("/", utils.checkLoginStatus, utils.handleErrors(renderAcctMgmt));

router.get("/login", utils.handleErrors(renderLogin));

router.get("/register", utils.handleErrors(renderSignUp));

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utils.handleErrors(accountLogin)
);

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utils.handleErrors(registerAccount)
);
module.exports = router;

