async function loadPortfolio() {
const container = document.getElementById("portfolio-container");


try {
    const response = await fetch("data.json");
    const projects = await response.json();
    
    
    projects.forEach(item => {
        const section = document.createElement("section");
        section.className = "section";
        const subtitleHTML = item.SubTitle ? `<h3 class="subtitle">${item.SubTitle.replace(/\\n/g, '<br>')}</h3>` : '';
        
        
        
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
        if (item.GoogleDriveLink) {
            platformLinks += `
                <a href="${item.GoogleDriveLink}" target="_blank" class="platform-badge google-drive-badge">
                    <img src="https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png" alt="Google Drive" class="drive-icon">
                    <span class="drive-text">View on Google Drive</span>
                </a>
            `;
        }
        // Create carousel HTML if media exists
        let carouselHTML = '';
        if (item.media && item.media.length > 0) {
            const carouselId = `carousel-${item.Title.replace(/\s+/g, '-').toLowerCase()}`;
            const hasMultipleSlides = item.media.length > 1;
            
            const slidesHTML = item.media.map((media, index) => {
                const activeClass = index === 0 ? 'active' : '';
                if (media.type === 'video') {
                    return `
                        <div class="carousel-slide ${activeClass}">
                            <iframe src="${media.url}" allowfullscreen title="${media.alt}"></iframe>
                        </div>
                    `;
                } else if (media.type === 'image') {
                    return `
                        <div class="carousel-slide ${activeClass}">
                            <img src="${media.url}" alt="${media.alt}" />
                        </div>
                    `;
                } else if (media.type === 'webgl') {
                    return `
                        <div class="carousel-slide ${activeClass} webgl-slide">
                            <iframe src="${media.url}" 
                                    width="100%" 
                                    height="100%" 
                                    frameborder="0" 
                                    allowfullscreen
                                    title="${media.alt}"
                                    class="webgl-frame">
                            </iframe>
                            <div class="webgl-overlay">
                                <div class="webgl-info">
                                    <span class="webgl-icon">🎮</span>
                                    <span class="webgl-text">Interactive WebGL Build</span>
                                </div>
                            </div>
                        </div>
                    `;
                }
                return '';
            }).join('');

            const indicatorsHTML = hasMultipleSlides ? 
                item.media.map((_, index) => {
                    const activeClass = index === 0 ? 'active' : '';
                    return `<button class="carousel-indicator ${activeClass}" data-slide="${index}"></button>`;
                }).join('') : '';

            const navigationHTML = hasMultipleSlides ? `
                <button class="carousel-nav prev" aria-label="Previous slide">❮</button>
                <button class="carousel-nav next" aria-label="Next slide">❯</button>
            ` : '';

            carouselHTML = `
                <div class="carousel">
                    <div class="carousel-container ${hasMultipleSlides ? 'multiple-slides' : ''}" data-carousel="${carouselId}">
                        ${slidesHTML}
                        ${navigationHTML}
                        <div class="carousel-indicators">
                            ${indicatorsHTML}
                        </div>
                    </div>
                </div>
            `;
        }

        section.innerHTML = `
            <div class="section-content">
                <div class="text">
                    <h2>${item.Title}</h2>
                        ${subtitleHTML}
                    <p>${item.Description}</p>
                    <div class="platform-links">
                        ${platformLinks}
                    </div>
                </div>
                ${carouselHTML}
            </div>
            <div class="project-footer">
                <div class="description">${(item.footer || item.Description).replace(/\\n/g, '<br>')}</div>
            </div>
        `;
        container.appendChild(section);
        
        // Initialize carousel functionality for this section
        initializeCarousel(section, item.media);
    });
} catch (error) {
    container.innerHTML = "<p>Failed to load portfolio data.</p>";
    console.error(error);
}
}

function initializeCarousel(section, mediaItems) {
    const carouselContainer = section.querySelector('.carousel-container');
    if (!carouselContainer || !mediaItems || mediaItems.length <= 1) {
        return; // No carousel needed
    }

    let currentSlide = 0;
    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    const indicators = carouselContainer.querySelectorAll('.carousel-indicator');
    const prevButton = carouselContainer.querySelector('.carousel-nav.prev');
    const nextButton = carouselContainer.querySelector('.carousel-nav.next');

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    // Event listeners
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }

    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }

    // Indicator click events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    // Auto-advance carousel every 5 seconds (optional)
    let autoAdvanceInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance on hover
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoAdvanceInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        autoAdvanceInterval = setInterval(nextSlide, 5000);
    });

    // Keyboard navigation
    carouselContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Make carousel focusable for keyboard navigation
    carouselContainer.setAttribute('tabindex', '0');
}


document.addEventListener("DOMContentLoaded", loadPortfolio);