const express = require("express");
const utils = require("../utilities");
const {
  renderLogin,
  renderSignUp,
  registerAccount,
} = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const router = express.Router();

router.get("/login", utils.handleErrors(renderLogin));

router.get("/register", utils.handleErrors(renderSignUp));

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  (_, res) => {
    res.status(200).send("login process");
  }
);

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utils.handleErrors(registerAccount)
);
module.exports = router;
