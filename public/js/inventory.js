"use strict";

const classificationList = document.getElementById("classification-list");
const invTable = document.getElementById("inventory-table");

const dialog = document.createElement("dialog");
dialog.id = "delete-dialog";
document.body.appendChild(dialog);

classificationList.addEventListener("change", async () => {
  const classification_id = classificationList.value;

  const fetchUrl = `/inv/get-inventory/${classification_id}`;

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
            <td><a href="#" class="action-link delete delete-link" data-inv-id="${item.inv_id}" data-inv-make="${item.inv_make}" data-inv-model="${item.inv_model}" title="Click to delete">Delete</a></td>
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

  invTable.addEventListener("click", (e) => {
    if (e.target.matches(".delete-link")) {
      e.preventDefault();
      const item = {
        inv_id: e.target.dataset.invId,
        inv_make: e.target.dataset.invMake,
        inv_model: e.target.dataset.invModel,
      };
      showDeleteDialog(item);
    }
  });
}

function showDeleteDialog(item) {
  dialog.innerHTML = `
    <form action="/inv/delete-inventory" method="post">
    <div class="dialog-warnings">
      <p class="confirm-msg">Confirm Deletion?</p>
      <p>Are you sure you want to delete <span class="inv-name">${item.inv_make} ${item.inv_model}</span>?</p>
      <b>This action is irreversible</b>
    </div>
      <input type="hidden" name="inv_id" value="${item.inv_id}">
      <input type="hidden" name="inv_make" value="${item.inv_make}">
      <input type="hidden" name="inv_model" value="${item.inv_model}">
      <div class="dialog-actions">
        <button type="submit" class="btn delete">Confirm Delete</button>
        <button type="button" id="cancel-delete" class="cancel btn">Cancel</button>
      </div>
    </form>`;
  dialog.showModal();

  const cancelButton = document.getElementById("cancel-delete");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      dialog.close();
    });
  }
}
