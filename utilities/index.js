//Build HTML of navlinks
function buildNav(data, path) {
  const navLinks = data
    .map(
      (link) => `
        <li>
          <a href="/inv/type/${
            link.classification_id
          }" title="See our inventory of ${
        link.classification_name
      } vehicles" class=${
        path && path.includes(link.classification_id) ? "active" : ""
      }>
            ${link.classification_name}
          </a>
        </li>
      `
    )
    .join("");

  const list = `<ul>
      <li><a href="/" title="Home page" class=${
        path && path === "/" ? "active" : ""
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
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
          vehicle.inv_make
        } ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${
          vehicle.inv_make
        } ${vehicle.inv_model} on CSE Motors" />
          </a>
        </figure>
        <div class="card-body">
          <div class="card-title">
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
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
          <a href="../../inv/detail/${vehicle.inv_id}" class="primary">View</a>
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

module.exports = { buildNav, buildClassGrid, handleErrors };
