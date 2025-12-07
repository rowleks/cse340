const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function buildNav(path, classId) {
  // Wayfinding helper function
  const getActiveNav = (link) => {
    if (path && path.startsWith("/inv/detail")) {
      if (classId && link === classId) {
        return "active";
      }
    } else if (path && path.startsWith("/inv/type")) {
      const pathId = parseInt(path.split("/").pop());
      if (link === pathId) {
        return "active";
      }
    } else {
      return "_";
    }
  };

  const classificationLinks = await invModel.getClassifications();

  const navLinks = classificationLinks
    .map(
      (link) => `
        <li>
          <a href="/inv/type/${
            link.classification_id
          }" title="See our inventory of ${
        link.classification_name
      } vehicles" class=${getActiveNav(link.classification_id)}>
            ${link.classification_name}
          </a>
        </li>
      `
    )
    .join("");

  const list = `<ul>
      <li><a href="/" title="Home page" class=${
        path && path === "/" ? "active" : "_"
      }>Home</a></li>
      ${navLinks}
    </ul>`;

  return list;
}

// Build HTML of inventory by classification
function buildClassGrid(data) {
  let grid;
  if (data.length > 0) {
    const vehicleListItems = data
      .map(
        (vehicle) => `
      <div class="buildcard">
        <figure>
          <a href="/inv/detail/${vehicle.inv_id}" title="View ${
          vehicle.inv_make
        } ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${
          vehicle.inv_make
        } ${vehicle.inv_model} on CSE Motors">
          </a>
        </figure>
        <div class="card-body">
          <div class="card-title">
            <a href="/inv/detail/${vehicle.inv_id}" title="View ${
          vehicle.inv_make
        } ${vehicle.inv_model} details">${vehicle.inv_make} ${
          vehicle.inv_model
        }</a>
          </div>
          <div class="card-meta">$${new Intl.NumberFormat("en-US").format(
            vehicle.inv_price
          )}</div>
        </div>
        <div class="card-actions">
          <a href="/inv/detail/${vehicle.inv_id}" class="primary">View</a>
        </div>
      </div>
    `
      )
      .join("");
    grid = `<div class="buildclass-grid">${vehicleListItems}</div>`;
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
}

const handleErrors = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

function buildSingleInv(data) {
  let grid = "";
  if (data.length > 0) {
    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_price,
      inv_miles,
      inv_color,
    } = data[0];

    const content = `
        <figure> 
          <img src="${inv_image}" alt="${inv_make} ${inv_model} on CSE Motors">
        </figure>
        <div class="inv-body">
          <div class="inv-title">
            <h2>${inv_make} ${inv_model} Details</h2>
          </div>
          <div class="inv-meta">
            <p><strong>Price: $${new Intl.NumberFormat("en-US").format(
              inv_price
            )}</strong></p>
            <p><strong>Description:</strong> ${inv_description}</p>
            <p><strong>Color:</strong> ${inv_color}</p>
            <p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(
              inv_miles
            )}</p>
          </div>
        </div>`;
    grid = `<div class="inv-detail-grid">${content}</div>`;
  } else {
    grid = "<p>Try Searching for other cars</p>";
  }
  return grid;
}

/* **************************************
 * Build the reviews HTML
 * ************************************ */
function buildReviews(reviews, inv_id, loggedIn) {
  const reviewForm = loggedIn
    ? `
      <form action="/review/add" method="POST" class="review-form">
        <input type="hidden" name="inv_id" value="${inv_id}">
        <label for="review_text">Leave a Review:</label>
        <textarea id="review_text" name="review_text" required rows="8"></textarea>
        <button type="submit" class="btn">Submit Review</button>
      </form>
    `
    : '<p>Please <a href="/account/login" class="redirect-link">log in</a> to leave a review.</p>';

  const reviewsList =
    reviews.length > 0
      ? `<ul class="reviews-list">
          ${reviews
            .map((review) => {
              const date = new Date(review.review_date).toLocaleDateString(
                "en-US"
              );
              return `
            <li>
              <p><strong>${
                review.account_firstname
              } ${review.account_lastname.charAt(
                0
              )}.</strong> <span class="review-date">(${date})</span></p>
              <p>${review.review_text}</p>
            </li>
          `;
            })
            .join("")}
        </ul>`
      : "<p>No reviews yet. Be the first to write one!</p>";

  return `
    <div class="reviews-wrapper">
    <h3>Customer Reviews</h3>
    <div class="reviews-container">
    ${reviewForm}
    ${reviewsList}
    </div>
    </div>
  `;
}

async function getClassificationList() {
  const list = await invModel.getClassifications();
  return list;
}

// JWT Middlewares

async function verifyJWTToken(req, res, next) {
  const accessToken = req.cookies.jwt;
  if (accessToken) {
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        req.flash("info", "Please log in");
        res.clearCookie("jwt");
        return res.status(403).redirect("/account/login");
      }

      res.locals.accountData = payload;
      res.locals.loggedIn = true;
      next();
    });
  } else {
    next();
  }
}

async function checkLoginStatus(req, res, next) {
  if (res.locals.loggedIn) {
    next();
  } else {
    req.flash("info", "Please log in");
    return res.redirect("/account/login");
  }
}

async function checkLoginAuthZ(req, res, next) {
  if (res.locals.accountData) {
    const { account_type } = res.locals.accountData;
    if (account_type === "Client") {
      req.flash(
        "info",
        "You are not authorized to view that page, please login with a priviledged account"
      );
      return res.redirect("/account/");
    } else {
      next();
    }
  } else {
    req.flash("info", "Please log in");
    return res.redirect("/account/login");
  }
}

async function buildClassSelectList() {
  const classificationlist = await getClassificationList();

  const options = classificationlist.map(
    (item) => `
    <option value="${item.classification_id}">${item.classification_name}</option>`
  );

  const selections = `
  <label for="classification-list">Choose a classification to see those inventory items</label>
  <select name="classification_id" id="classification-list">
  <option value="" disabled selected>Select a classification</option>
  ${options}
  </select>`;

  return selections;
}

module.exports = {
  buildNav,
  buildClassGrid,
  handleErrors,
  buildSingleInv,
  getClassificationList,
  verifyJWTToken,
  checkLoginStatus,
  buildClassSelectList,
  checkLoginAuthZ,
  buildReviews,
};
