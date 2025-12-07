const password = document.getElementById("password");
const hidePword = document.getElementById("hide-password");
const showPword = document.getElementById("show-password");
const eyeContainer = document.querySelector(".eye-container");


if (eyeContainer) {
  eyeContainer.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showPword.classList.toggle("hide");
    hidePword.classList.toggle("hide");

    password.type = password.type === "password" ? "text" : "password";
  });
}
