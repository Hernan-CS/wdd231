const cardsContainer = document.getElementById("cards");
const gridViewBtn = document.getElementById("gridView");
const listViewBtn = document.getElementById("listView");

async function getMembers() {
  const response = await fetch("data/members.json");
  const data = await response.json();
  displayMembers(data.members);
}

function displayMembers(members) {
  cardsContainer.innerHTML = "";
  members.forEach(member => {
    const card = document.createElement("section");
    card.classList.add("card");
    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name} logo">
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank">${member.website}</a>
    `;
    cardsContainer.appendChild(card);
  });
}

function setGridView() {
  cardsContainer.classList.add("grid-view");
  cardsContainer.classList.remove("list-view");
  gridViewBtn.classList.add("active");
  listViewBtn.classList.remove("active");
}

function setListView() {
  cardsContainer.classList.add("list-view");
  cardsContainer.classList.remove("grid-view");
  listViewBtn.classList.add("active");
  gridViewBtn.classList.remove("active");
}

gridViewBtn.addEventListener("click", setGridView);
listViewBtn.addEventListener("click", setListView);

getMembers();