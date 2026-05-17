/* ==========================================================================
   TAWK.TO PREMIUM LIVE CHAT INTEGRATION & PERFORMANCE OPTIMIZATION
   ========================================================================== */

var Tawk_API = Tawk_API || {};

// Force the actual chat window to open on the bottom-left
Tawk_API.customStyle = {
    visibility: {
        desktop: {
            position: 'bl',
            xOffset: 20,
            yOffset: 20
        },
        mobile: {
            position: 'bl',
            xOffset: 15,
            yOffset: 15
        }
    }
};

var Tawk_LoadStart = new Date();
let tawkScriptLoaded = false;

// 1. Lazy Loading Tawk.to Script for SEO & Core Web Vitals optimization
function loadTawkScript() {
    if (tawkScriptLoaded) return;
    tawkScriptLoaded = true;

    // Custom onload and department check hook
    Tawk_API.onLoad = function() {
        console.log("Tawk.to live chat loaded successfully.");
        // Hide default widget immediately to use our custom beautiful button
        Tawk_API.hideWidget();
        
        // Initialize status badge
        const currentStatus = Tawk_API.getStatus() || 'offline';
        updateAllStatusDots(currentStatus);
        
        // Sync contact form details if already entered before load
        syncContactFormToTawk();
    };

    Tawk_API.onStatusChange = function(status) {
        updateAllStatusDots(status);
    };

    // Show our custom button again when chat is minimized or hidden
    Tawk_API.onChatMinimized = function() {
        Tawk_API.hideWidget();
        const wrapper = document.getElementById('custom-tawk-wrapper');
        if (wrapper) wrapper.style.display = 'block';
    };

    Tawk_API.onChatHidden = function() {
        const wrapper = document.getElementById('custom-tawk-wrapper');
        if (wrapper) wrapper.style.display = 'block';
    };

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6a092d9baddb681c3b7658ab/1joptkan3';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
}

// Attach listeners for early load on interaction (LCP/FID optimization)
function initTawkLazyLoad() {
    const loadEvents = ['mouseover', 'keydown', 'touchstart', 'scroll'];
    const triggerLoad = () => {
        loadTawkScript();
        loadEvents.forEach(event => window.removeEventListener(event, triggerLoad));
    };

    loadEvents.forEach(event => window.addEventListener(event, triggerLoad, { passive: true }));

    // Fallback load after 4.5 seconds of idle page load
    setTimeout(loadTawkScript, 4500);
}

// 2. Status Dot & Tooltip Updates
function updateAllStatusDots(status) {
    const dots = document.querySelectorAll('.tawk-status-dot');
    dots.forEach(dot => {
        dot.className = 'tawk-status-dot ' + status;
        
        // Find if trigger text exists and append tooltip/description
        const parent = dot.closest('.tawk-trigger-text');
        if (parent) {
            const statusLabel = status === 'online' ? ' (Online Now)' : ' (Leave a message)';
            parent.setAttribute('title', 'Click to Chat' + statusLabel);
        }
    });
}

// 3. Sync Contact Form Inputs with Tawk.to Visitor Attributes
function syncContactFormToTawk() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const nameInput = contactForm.querySelector('input[name="name"]');
    const emailInput = contactForm.querySelector('input[name="email"]');
    if (!nameInput || !emailInput) return;

    const syncAction = () => {
        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();

        if (nameVal || emailVal) {
            if (window.Tawk_API && typeof Tawk_API.setAttributes === 'function') {
                Tawk_API.setAttributes({
                    'name': nameVal || undefined,
                    'email': emailVal || undefined
                }, function(error) {
                    if (error) console.error("Error syncing with Tawk.to:", error);
                });
            }
        }
    };

    // Debounce syncing to avoid excessive API requests
    let debounceTimer;
    const debouncedSync = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(syncAction, 1000);
    };

    nameInput.addEventListener('input', debouncedSync);
    emailInput.addEventListener('input', debouncedSync);
}

// 4. Custom Interactive Floating Button Injection
function injectCustomTawkButton() {
    if (document.getElementById('custom-tawk-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'custom-tawk-wrapper';
    wrapper.innerHTML = `
        <div class="tawk-btn-pulse"></div>
        <div class="custom-tawk-btn" id="custom-tawk-btn" role="button" aria-label="Open Live Chat">
            <i class="fas fa-comment-dots"></i>
            <span class="tawk-text">Let's Chat!</span>
        </div>
    `;
    document.body.appendChild(wrapper);

    const btn = document.getElementById('custom-tawk-btn');
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        loadTawkScript(); // Ensure it's loaded
        
        if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
            window.Tawk_API.showWidget();
            window.Tawk_API.maximize();
        } else {
            // Hook to maximize once loaded
            const prevOnLoad = window.Tawk_API.onLoad;
            window.Tawk_API.onLoad = function() {
                if (prevOnLoad) prevOnLoad();
                window.Tawk_API.showWidget();
                window.Tawk_API.maximize();
            };
        }
        
        // Hide our custom button when chat opens
        wrapper.style.display = 'none';
    });
}

// 5. Global Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    initTawkLazyLoad();
    setupContactFormSync();
    injectCustomTawkButton();

    // Trigger open and maximize chat when clicking any text links
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.tawk-trigger-text');
        if (trigger) {
            e.preventDefault();
            loadTawkScript();
            
            if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
                window.Tawk_API.showWidget();
                window.Tawk_API.maximize();
            } else {
                const prevOnLoad = Tawk_API.onLoad;
                Tawk_API.onLoad = function() {
                    if (prevOnLoad) prevOnLoad();
                    window.Tawk_API.showWidget();
                    window.Tawk_API.maximize();
                };
            }
        }
    });
});

function setupContactFormSync() {
    // If DOM is already loaded, execute sync binding immediately
    syncContactFormToTawk();
}