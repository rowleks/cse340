"use strict";

const classificationList = document.getElementById("classification-list");
const invTable = document.getElementById("inventory-table");

classificationList.addEventListener("change", async () => {
  const classification_id = classificationList.value;

  const fetchUrl = `/inv/getInventory/${classification_id}`;

  try {
    invTable.innerHTML = '<p class="notice">Loading...</p>';

    const res = await fetch(fetchUrl);
    if (!res.ok) {
      invTable.innerHTML = "";
      throw Error("Failed to fetch data");
    }
    const data = await res.json();
    buildInvList(data);
  } catch (err) {
    invTable.innerHTML =
      '<p class="notice">Something went wrong, please try again</p>';
    console.error("Something went wrong ", err.message);
  }
});

function buildInvList(data) {
  const thead = `<thead>
    <tr>
    <th>Vehicle Name</th>
    <th colspan="2">Action</th>
    </tr>
    </thead>`;

  let tableData;
  if (data.length > 0) {
    const tbody = `<tbody>
      ${data
        .map(
          (item) => `
          <tr>
            <td><a href="/inv/detail/${item.inv_id}" title="View ${item.inv_make} ${item.inv_model} details">${item.inv_make} ${item.inv_model}</a></td>
            <td><a href="/inv/edit/${item.inv_id}" class="action-link edit" title="Click to update">Modify</a></td>
            <td><a href="/inv/delete/${item.inv_id}" class="action-link delete" title="Click to delete">Delete</a></td>
          </tr>
        `
        )
        .join("")}
      </tbody>`;
    tableData = `${thead}${tbody}`;
  } else {
    tableData =
      '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  invTable.innerHTML = tableData;
}
