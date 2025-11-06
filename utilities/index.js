//Build HTML of navlinks
function buildNav(data) {
  const navLinks = data
    .map(
      (link) => `
        <li>
          <a href="/inv/type/${link.classification_id}" title="See our inventory of ${link.classification_name} vehicles">
            ${link.classification_name}
          </a>
        </li>
      `
    )
    .join("");

  const list = `<ul>
      <li><a href="/" title="Home page">Home</a></li>
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
      <li>
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
          vehicle.inv_make
        } ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${
          vehicle.inv_make
        } ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
          vehicle.inv_make
        } ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(
            vehicle.inv_price
          )}</span>
        </div>
      </li>
    `
      )
      .join("");
    grid = `<ul id="inv-display">${vehicleListItems}</ul>`;
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
}

module.exports = { buildNav, buildClassGrid };
