const form = document.getElementById("update-form");
const updateBtn = document.getElementById("update-button");

form.addEventListener("change", () => {
  updateBtn.removeAttribute("disabled");
});
