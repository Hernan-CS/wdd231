const menuButton = document.querySelector("#menu");
const navMenu = document.querySelector("#navMenu");

menuButton.addEventListener("click", () => {
  navMenu.classList.toggle("open");

  if (menuButton.textContent === "☰") {
    menuButton.textContent = "✖";
  } else {
    menuButton.textContent = "☰";
  }
});