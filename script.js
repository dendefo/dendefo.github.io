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
        if (item.GitHubLink) {
            platformLinks += `
                <a href="${item.GitHubLink}" target="_blank" class="platform-badge github-badge">
                    <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span class="github-text">View on GitHub</span>
                </a>
            `;
        }
        if (item.GitHubPageLink) {
            platformLinks += `
                <a href="${item.GitHubPageLink}" target="_blank" class="platform-badge github-page-badge">
                    <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span class="github-text">GitHub Page</span>
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
                            <button onclick="openWebGLFullscreen('${media.url}')" class="webgl-fullscreen-carousel-btn">
                                <div class="webgl-play-content">
                                    <div class="webgl-play-icon">🎮</div>
                                    <div class="webgl-play-text">Play in browser</div>
                                    <div class="webgl-game-title">${media.alt}</div>
                                </div>
                            </button>
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
                <div class="carousel-wrapper">
                    <div class="carousel">
                        <div class="carousel-container ${hasMultipleSlides ? 'multiple-slides' : ''}" data-carousel="${carouselId}">
                            ${slidesHTML}
                        </div>
                        ${navigationHTML}
                    </div>
                    ${hasMultipleSlides ? `<div class="carousel-indicators">${indicatorsHTML}</div>` : ''}
                    ${item.media && item.media.length > 0 ? `<div class="carousel-alt-text" data-carousel-alt="${carouselId}">${item.media[0].alt}</div>` : ''}
                </div>
            `;
        }

        const myTitleHTML = item.MyTitle ? `<div class="my-title">${item.MyTitle}${item.TeamSize ? ` • Team of ${item.TeamSize}` : ''}</div>` : '';
        
        section.innerHTML = `
            <div class="section-content">
                <div class="text-section">
                    <div class="text">
                        <div class="title-container">
                            <h2>${item.Title}</h2>
                            ${dateHTML}
                        </div>
                        ${subtitleHTML}
                        ${myTitleHTML}
                        <ul class="description-list">
                            ${Array.isArray(item.Description) ? 
                                item.Description.map(point => `<li>${point}</li>`).join('') :
                                `<li>${item.Description}</li>`
                            }
                        </ul>
                    </div>
                    <div class="text-footer">
                        <div class="description">${(item.footer || item.Description).replace(/\\n/g, '<br>')}</div>
                    </div>
                </div>
                <div class="carousel-section">
                    <div class="platform-links">
                        ${platformLinks}
                    </div>
                    ${carouselHTML}
                </div>
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
    const indicators = section.querySelectorAll('.carousel-indicator');
    const prevButton = carouselWrapper.querySelector('.carousel-nav.prev');
    const nextButton = carouselWrapper.querySelector('.carousel-nav.next');
    const altTextElement = section.querySelector('.carousel-alt-text');

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

        // Update alt text
        if (altTextElement && mediaItems[index]) {
            altTextElement.textContent = mediaItems[index].alt;
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

    // Event listeners are now handled below with pause functionality

    // Auto-advance carousel every 5 seconds
    let autoAdvanceInterval = setInterval(nextSlide, 5000);
    let isPaused = false;
    let pauseTimeout;

    function pauseCarousel() {
        if (!isPaused) {
            clearInterval(autoAdvanceInterval);
            isPaused = true;
        }
        // Clear any existing resume timeout
        clearTimeout(pauseTimeout);
    }

    function resumeCarousel() {
        // Set a timeout to resume after user interaction stops
        clearTimeout(pauseTimeout);
        pauseTimeout = setTimeout(() => {
            if (isPaused) {
                autoAdvanceInterval = setInterval(nextSlide, 5000);
                isPaused = false;
            }
        }, 2000); // Resume 2 seconds after last interaction
    }

    // Pause on hover
    carouselContainer.addEventListener('mouseenter', pauseCarousel);
    carouselContainer.addEventListener('mouseleave', resumeCarousel);

    // Pause on button clicks
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            pauseCarousel();
            nextSlide();
            resumeCarousel();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            pauseCarousel();
            prevSlide();
            resumeCarousel();
        });
    }

    // Pause on indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            pauseCarousel();
            showSlide(index);
            resumeCarousel();
        });
    });

    // Pause on keyboard navigation
    carouselContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            pauseCarousel();
            prevSlide();
            resumeCarousel();
        } else if (e.key === 'ArrowRight') {
            pauseCarousel();
            nextSlide();
            resumeCarousel();
        }
    });

    // Pause when carousel gains focus
    carouselContainer.addEventListener('focus', pauseCarousel);
    carouselContainer.addEventListener('blur', resumeCarousel);

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
    const webglModal = document.getElementById('webgl-fullscreen-modal');
    
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
    } else if (webglModal && webglModal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeWebGLFullscreen();
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

window.openWebGLFullscreen = function(webglUrl) {
    // Create a fullscreen modal for the WebGL build
    let fullscreenModal = document.getElementById('webgl-fullscreen-modal');
    if (!fullscreenModal) {
        fullscreenModal = document.createElement('div');
        fullscreenModal.id = 'webgl-fullscreen-modal';
        fullscreenModal.className = 'webgl-fullscreen-modal';
        fullscreenModal.innerHTML = `
            <div class="webgl-fullscreen-backdrop" onclick="window.closeWebGLFullscreen()"></div>
            <div class="webgl-fullscreen-content">
                <button class="webgl-fullscreen-close" onclick="window.closeWebGLFullscreen()">&times;</button>
                <iframe id="webgl-fullscreen-iframe" 
                        src="" 
                        frameborder="0" 
                        allowfullscreen
                        allow="autoplay; fullscreen; microphone; camera"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                        style="width: 100%; height: 100%; border: none;">
                </iframe>
            </div>
        `;
        document.body.appendChild(fullscreenModal);
        
        // Add CSS styles for the modal
        if (!document.getElementById('webgl-fullscreen-styles')) {
            const style = document.createElement('style');
            style.id = 'webgl-fullscreen-styles';
            style.textContent = `
                .webgl-fullscreen-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 10000;
                }
                .webgl-fullscreen-modal.active {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .webgl-fullscreen-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .webgl-fullscreen-content {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                .webgl-fullscreen-close {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.7);
                    border: none;
                    color: white;
                    font-size: 30px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10001;
                    backdrop-filter: blur(10px);
                }
                .webgl-fullscreen-close:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Set the iframe source and show modal
    const iframe = fullscreenModal.querySelector('#webgl-fullscreen-iframe');
    iframe.src = webglUrl;
    fullscreenModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeWebGLFullscreen = function() {
    const modal = document.getElementById('webgl-fullscreen-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Clear iframe src to stop the game
        const iframe = modal.querySelector('#webgl-fullscreen-iframe');
        if (iframe) {
            iframe.src = '';
        }
    }
};




document.addEventListener("DOMContentLoaded", async function() {
    await loadConfiguration();
    await loadPortfolio();
});