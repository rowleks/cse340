//Build HTML of navlinks
const invModel = require("../models/inventory-model");

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

module.exports = { buildNav, buildClassGrid, handleErrors, buildSingleInv };
