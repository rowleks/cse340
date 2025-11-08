const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const app = express();
const static = require("./routes/static");
const { renderHome, renderError } = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utils = require("./utilities");

// View Engine and Templates (Middlewares)
app.set("view engine", "ejs");
app.set("layout", "./layouts/layout");
app.use(expressLayouts);
app.use(static);

// Routes
app.get("/", utils.handleErrors(renderHome));
app.use("/inv", inventoryRoute);

// 404 Route
app.use(async (_, __, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

// Express Error Handler
app.use(renderError);

// env variables
const port = process.env.PORT || 8000;
const host = process.env.HOST || "render";

// Connection onfirmation
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
