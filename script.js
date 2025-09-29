async function loadPortfolio() {
const container = document.getElementById("portfolio-container");


try {
const response = await fetch("data.json");
const projects = await response.json();


projects.forEach(item => {
const section = document.createElement("section");
section.className = "section";


        // Create platform links HTML
        let platformLinks = '';
        if (item.AndroidLink) {
            platformLinks += `
                <a href="${item.AndroidLink}" target="_blank" class="platform-badge">
                    <img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Get it on Google Play" class="store-badge">
                </a>
            `;
        }
        if (item.IOSLink) {
            platformLinks += `
                <a href="${item.IOSLink}" target="_blank" class="platform-badge">
                    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" class="store-badge">
                </a>
            `;
        }

        section.innerHTML = `
            <div class="text">
                <h2>${item.Title}</h2>
                <p>${item.Description}</p>
                <div class="platform-links">
                    ${platformLinks}
                </div>
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