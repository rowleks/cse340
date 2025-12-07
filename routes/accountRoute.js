const express = require("express");
const utils = require("../utilities");
const {
  renderLogin,
  renderSignUp,
  registerAccount,
  accountLogin,
  renderAcctMgmt,
  accountLogout,
  renderUpdateAccount,
  updateAccountInfo,
  changePassword,
} = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const router = express.Router();

router.get("/", utils.checkLoginStatus, utils.handleErrors(renderAcctMgmt));

router.get("/login", utils.handleErrors(renderLogin));
router.get("/logout", utils.handleErrors(accountLogout));

router.get("/register", utils.handleErrors(renderSignUp));

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utils.handleErrors(accountLogin),
);

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utils.handleErrors(registerAccount),
);

// Account update routes
router.get(
  "/update/:account_id",
  utils.checkLoginStatus,
  utils.handleErrors(renderUpdateAccount),
);

router.post(
  "/update-info",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utils.handleErrors(updateAccountInfo),
);

router.post(
  "/change-password",
  regValidate.changePasswordRules(),
  regValidate.checkPasswordData,
  utils.handleErrors(changePassword),
);

module.exports = router;
