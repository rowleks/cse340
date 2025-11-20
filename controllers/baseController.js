const utils = require("../utilities/");

//Render the home view
async function renderHome(req, res) {
  const path = req.originalUrl;
  const nav = await utils.buildNav(path);

  res.render("index", { title: "Home", nav });
}

async function renderError(err, req, res, _) {
  const nav = await utils.buildNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  let message;
  if (err.status == 404) {
    message = "Page Not found";
  } else {
    message = "Something went wrong. Try a different route.";
  }

  res.render("errors/error", {
    title: err.status ? "404 Error" : "Server Error",
    nav,
    message,
  });
}

module.exports = { renderHome, renderError };
