const utils = require("../utilities/");
async function renderServerError(_, res) {
  // Comment out nav to generate the error
  // const nav = await utils.buildNav();

  res.render("errors/error", {
    title: err.status || "Server Error",
    nav,
    message,
  });
}

module.exports = { renderServerError };
