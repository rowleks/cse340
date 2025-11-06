const invModel = require("../models/inventory-model");
const util = {
  getNav: async function () {
    const data = await invModel.getClassifications();
    const navLinks = data.rows
      .map(
        (row) => `
        <li>
          <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
            ${row.classification_name}
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
  },
};

module.exports = util;
