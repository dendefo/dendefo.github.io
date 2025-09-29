async function loadPortfolio() {
const container = document.getElementById("portfolio-container");


try {
const response = await fetch("data.json");
const projects = await response.json();


projects.forEach(item => {
const section = document.createElement("section");
section.className = "section";


section.innerHTML = `
<div class="text">
<h2>${item.Title}</h2>
<p>${item.Description}</p>
</div>
<div class="video">
<iframe src="${item.VideoLink}" allowfullscreen></iframe>
</div>
`;


container.appendChild(section);
});
} catch (error) {
container.innerHTML = "<p>Failed to load portfolio data.</p>";
console.error(error);
}
}


document.addEventListener("DOMContentLoaded", loadPortfolio);