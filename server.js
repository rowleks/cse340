const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const app = express();
const static = require("./routes/static");

const { renderHome, renderError } = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");

const errorRoute = require("./routes/errorRoute");
const accountRoute = require("./routes/accountRoute");
const utils = require("./utilities");

const pool = require("./database");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const connectFlash = require("connect-flash")();
const messages = require("express-messages");

const bodyParser = require("body-parser");

// View Engine and Templates (Middlewares)
app.set("view engine", "ejs");
app.set("layout", "./layouts/layout");
app.use(expressLayouts);
app.use(static);

// Sessions and Flash messages
app.use(
  session({
    store: new pgSession({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

app.use(connectFlash);

app.use((req, res, next) => {
  res.locals.messages = messages(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", utils.handleErrors(renderHome));
app.use("/inv", inventoryRoute);
app.use("/error", errorRoute);
app.use("/account", accountRoute);

// 404 Route
app.use((_, __, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

// Express Error Handler
app.use(renderError);

// env variables
const port = process.env.PORT || 8000;
const host = process.env.HOST || "render";

// Connection confirmation
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
