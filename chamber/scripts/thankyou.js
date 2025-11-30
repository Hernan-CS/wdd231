document.addEventListener("DOMContentLoaded", () => {
  const stamp = new Date();

  const formatted =
    stamp.toLocaleDateString() +
    " – " +
    stamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  document.getElementById("timestamp").textContent =
    "Submitted on: " + formatted;
});