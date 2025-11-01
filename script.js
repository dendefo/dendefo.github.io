// Global configuration
let siteConfig = {};

async function loadConfiguration() {
    try {
        const response = await fetch("config.json");
        siteConfig = await response.json();
        
        // Set page title
        document.getElementById("page-title").textContent = siteConfig.site.title;
        
        // Generate header
        generateHeader();
        
        // Generate footer
        generateFooter();
        
    } catch (error) {
        console.error("Failed to load configuration:", error);
    }
}

function generateHeader() {
    const header = document.getElementById("site-header");
    const config = siteConfig.header;
    
    const socialLinksHTML = config.socialLinks.map(link => 
        `<a href="${link.url}" target="_blank" class="social-link ${link.class}">
            <span>${link.icon} ${link.name}</span>
        </a>`
    ).join('');
    
    header.innerHTML = `
        <h1>${config.title}</h1>
        <div class="header-actions">
            <a href="${config.downloadCV.file}" download="${config.downloadCV.filename}" class="cv-link">
                <span>${config.downloadCV.text}</span>
            </a>
            <div class="social-links">
                ${socialLinksHTML}
            </div>
        </div>
    `;
}

function generateFooter() {
    const footer = document.getElementById("site-footer");
    footer.innerHTML = `<p>${siteConfig.site.footerText}</p>`;
}

async function loadPortfolio() {
const container = document.getElementById("portfolio-container");

try {
    const response = await fetch("data.json");
    const projects = await response.json();
    
    
    projects.forEach(item => {
        const section = document.createElement("section");
        section.className = "section";
        const subtitleHTML = item.SubTitle ? `<h3 class="subtitle">${item.SubTitle.replace(/\\n/g, '<br>')}</h3>` : '';
        const dateHTML = item.ProjectDate ? `<div class="project-date-timeline"><span class="date-icon">📅</span>${item.ProjectDate}</div>` : '';
        
        
        
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
                            <img src="${media.url}" alt="${media.alt}" class="clickable-image" onclick="window.openImageModal(this);" />
                        </div>
                    `;
                } else if (media.type === 'webgl') {
                    const webglId = `webgl-${Date.now()}-${index}`;
                    return `
                        <div class="carousel-slide ${activeClass} webgl-slide" data-webgl-id="${webglId}">
                            <div class="webgl-overlay">🎮 Interactive WebGL Build</div>
                            <iframe src="${media.url}" 
                                    frameborder="0" 
                                    allowfullscreen
                                    allow="autoplay; fullscreen; microphone; camera"
                                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                                    onload="console.log('WebGL loaded successfully')"
                                    onerror="console.error('WebGL failed to load:', '${media.url}')"
                                    style="width: 100%; height: 100%; border: none; border-radius: 18px;">
                                <p>Loading WebGL build...</p>
                            </iframe>
                            <div class="webgl-controls" id="webgl-controls-${carouselId}">
                                <button onclick="openWebGLFullscreen('${media.url}')" class="webgl-fullscreen-btn">
                                    🔍 Open in fullscreen
                                </button>
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
                        <div class="carousel-indicators">
                            ${indicatorsHTML}
                        </div>
                    </div>
                    ${navigationHTML}
                </div>
            `;
        }

        section.innerHTML = `
            <div class="section-content">
                <div class="text">
                    <div class="title-container">
                        <h2>${item.Title}</h2>
                        ${dateHTML}
                    </div>
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
    const errorText = siteConfig.content?.errorText || "Failed to load portfolio data.";
    container.innerHTML = `<p>${errorText}</p>`;
    console.error(error);
}
}

function initializeCarousel(section, mediaItems) {
    const carouselContainer = section.querySelector('.carousel-container');
    const carouselWrapper = section.querySelector('.carousel');
    if (!carouselContainer || !mediaItems || mediaItems.length <= 1) {
        return; // No carousel needed
    }

    let currentSlide = 0;
    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    const indicators = carouselContainer.querySelectorAll('.carousel-indicator');
    const prevButton = carouselWrapper.querySelector('.carousel-nav.prev');
    const nextButton = carouselWrapper.querySelector('.carousel-nav.next');

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
    
    // Images are now clickable via inline onclick handlers
}

// Global variables for modal carousel
let modalImages = [];
let currentModalIndex = 0;

// Image Modal Functions - Make them global
window.openImageModal = function(imgElement) {
    // Find all images in the same project
    const projectSection = imgElement.closest('.section');
    const allProjectImages = projectSection.querySelectorAll('img.clickable-image');
    
    // Store images and find current index
    modalImages = Array.from(allProjectImages);
    currentModalIndex = modalImages.indexOf(imgElement);
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('imageModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="window.closeImageModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="window.closeImageModal()">&times;</button>
                <button class="modal-nav modal-prev" onclick="window.prevModalImage()" style="display: none;">‹</button>
                <button class="modal-nav modal-next" onclick="window.nextModalImage()" style="display: none;">›</button>
                <div class="modal-click-area modal-click-left" onclick="window.prevModalImage()" style="display: none;"></div>
                <div class="modal-click-area modal-click-right" onclick="window.nextModalImage()" style="display: none;"></div>
                <img id="modalImage" src="" alt="" />
                <div class="modal-caption"></div>
                <div class="modal-counter" style="display: none;"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Update modal content
    updateModalImage();
    
    // Show/hide navigation based on number of images
    const hasMultipleImages = modalImages.length > 1;
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');
    const clickLeft = modal.querySelector('.modal-click-left');
    const clickRight = modal.querySelector('.modal-click-right');
    const counter = modal.querySelector('.modal-counter');
    
    if (hasMultipleImages) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        clickLeft.style.display = 'block';
        clickRight.style.display = 'block';
        counter.style.display = 'block';
    } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        clickLeft.style.display = 'none';
        clickRight.style.display = 'none';
        counter.style.display = 'none';
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function updateModalImage() {
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.querySelector('.modal-caption');
    const modalCounter = document.querySelector('.modal-counter');
    
    if (modalImages[currentModalIndex]) {
        const currentImg = modalImages[currentModalIndex];
        modalImage.src = currentImg.src;
        modalImage.alt = currentImg.alt;
        modalCaption.textContent = currentImg.alt;
        
        if (modalImages.length > 1) {
            modalCounter.textContent = `${currentModalIndex + 1} / ${modalImages.length}`;
        }
    }
}

window.nextModalImage = function() {
    if (modalImages.length > 0) {
        currentModalIndex = (currentModalIndex + 1) % modalImages.length;
        updateModalImage();
    }
}

window.prevModalImage = function() {
    if (modalImages.length > 0) {
        currentModalIndex = (currentModalIndex - 1 + modalImages.length) % modalImages.length;
        updateModalImage();
    }
}

window.closeImageModal = function() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal with Escape key and navigation with arrow keys
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('imageModal');
    if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeImageModal();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevModalImage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextModalImage();
        }
    }
});

// Global click listener for images as backup
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && e.target.hasAttribute('data-modal-image')) {
        console.log('Global click listener activated for image:', e.target.src);
        e.stopPropagation();
        openImageModal(e.target);
    }
});

// WebGL Controls Functions

window.openWebGLFullscreen = function(webglId) {
    const iframe = document.getElementById(`iframe-${webglId}`);
    if (iframe) {
        // Try different fullscreen methods for cross-browser compatibility
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) {
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
        } else {
            // Fallback: open in new window
            const newWindow = window.open(iframe.src, '_blank', 'width=1280,height=720,scrollbars=no,resizable=yes');
            if (newWindow) {
                newWindow.focus();
            }
        }
    }
};




document.addEventListener("DOMContentLoaded", async function() {
    await loadConfiguration();
    await loadPortfolio();
});