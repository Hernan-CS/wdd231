const yearEl = document.getElementById("year");
const modifiedEl = document.getElementById("lastModified");
const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

if (yearEl) yearEl.textContent = new Date().getFullYear();
if (modifiedEl) modifiedEl.textContent = document.lastModified;

menuButton?.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 640) navMenu.classList.remove("show");
});