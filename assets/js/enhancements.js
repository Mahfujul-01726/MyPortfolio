/* ============================================
   ENHANCED JAVASCRIPT - FORM VALIDATION & FEATURES
   ============================================ */

// Form Validation and Handling
class FormValidator {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.setupValidation();
        this.setupFormSubmit();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input[type="text"], textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.validateFieldRealtime(e.target));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (field.name === 'name') {
            isValid = value.length >= 2;
            errorMessage = 'Name must be at least 2 characters';
        } else if (field.name === 'email') {
            isValid = this.isValidEmail(value);
            errorMessage = 'Please enter a valid email address';
        } else if (field.name === 'message') {
            isValid = value.length >= 10;
            errorMessage = 'Message must be at least 10 characters';
        } else if (field.name === 'phone' && value.length > 0) {
            isValid = this.isValidPhone(value);
            errorMessage = 'Please enter a valid phone number';
        }

        this.showValidationState(field, isValid, errorMessage);
        return isValid;
    }

    validateFieldRealtime(field) {
        const value = field.value.trim();

        if (value.length === 0) {
            this.clearValidationState(field);
            return;
        }

        if (field.name === 'name') {
            this.showValidationState(field, value.length >= 2, '');
        } else if (field.name === 'email') {
            this.showValidationState(field, this.isValidEmail(value), '');
        } else if (field.name === 'message') {
            this.showValidationState(field, value.length >= 10, '');
        } else if (field.name === 'phone') {
            this.showValidationState(field, this.isValidPhone(value), '');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
        return phoneRegex.test(phone);
    }

    showValidationState(field, isValid, errorMessage) {
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            const errorEl = field.nextElementSibling;
            if (errorEl && errorEl.classList.contains('error-message')) {
                errorEl.classList.remove('show');
            }
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
            if (errorMessage) {
                let errorEl = field.nextElementSibling;
                if (!errorEl || !errorEl.classList.contains('error-message')) {
                    errorEl = document.createElement('div');
                    errorEl.className = 'error-message';
                    field.parentNode.insertBefore(errorEl, field.nextSibling);
                }
                errorEl.textContent = errorMessage;
                errorEl.classList.add('show');
            }
        }
    }

    clearValidationState(field) {
        field.classList.remove('valid', 'invalid');
        const errorEl = field.nextElementSibling;
        if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.classList.remove('show');
        }
    }

    setupFormSubmit() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const inputs = this.form.querySelectorAll('input[type="text"], textarea');
        let allValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }

        // Send form data
        this.sendForm();
    }

    sendForm() {
        emailjs.init("user_TTDmetQLYgWCLzHTDgqxm");

        emailjs.sendForm('contact_service', 'template_contact', '#contact-form')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                this.form.reset();
                this.clearAllValidation();
                this.showNotification('✓ Message sent successfully! I will get back to you soon.', 'success');
            }, (error) => {
                console.log('FAILED...', error);
                this.showNotification('✗ Failed to send message. Please try again.', 'error');
            });
    }

    clearAllValidation() {
        const inputs = this.form.querySelectorAll('input[type="text"], textarea');
        inputs.forEach(input => this.clearValidationState(input));
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `${type}-message`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Scroll Reveal Animation
class ScrollReveal {
    constructor() {
        this.setupScrollReveal();
    }

    setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        // Observe all sections and cards
        const elements = document.querySelectorAll(
            'section, .box, .bar, .social-icons a, .timeline, .container'
        );
        // Filter out contact section and its container to keep form visible
        const filtered = Array.from(elements).filter(el =>
            !el.classList.contains('contact') &&
            !(el.classList.contains('container') && el.closest('.contact'))
        );
        filtered.forEach(el => {
            el.classList.add('scroll-reveal');
            observer.observe(el);
        });
        // Still animate contact heading on scroll
        const contactHeading = document.querySelector('.contact .heading');
        if (contactHeading) {
            contactHeading.classList.add('scroll-reveal');
            observer.observe(contactHeading);
        }
    }
}

// Smooth Scroll Enhancement
class SmoothScroll {
    constructor() {
        this.setupSmoothScroll();
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.logMetrics();
    }

    logMetrics() {
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page Load Time: ${pageLoadTime}ms`);
            });
        }
    }
}

// Lazy Loading Images
class LazyLoadImages {
    constructor() {
        this.initLazyLoad();
    }

    initLazyLoad() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                observer.observe(img);
            });
        }
    }
}

// Initialize all enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize form validator
    if (document.getElementById('contact-form')) {
        new FormValidator();
    }

    // Initialize scroll animations
    new ScrollReveal();

    // Setup smooth scrolling
    new SmoothScroll();

    // Monitor performance
    new PerformanceMonitor();

    // Setup lazy loading
    new LazyLoadImages();

    // Additional enhancements
    setupScrollTop();
    setupNavbarAnimation();
    setupMobileMenu();
});

// Enhanced Scroll Top Button
function setupScrollTop() {
    const scrollTop = document.getElementById('scroll-top');
    if (!scrollTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTop.classList.add('active');
        } else {
            scrollTop.classList.remove('active');
        }
    });

    scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhanced Navbar Animation
function setupNavbarAnimation() {
    const navbar = document.querySelector('.navbar');
    const menu = document.getElementById('menu');
    if (!navbar || !menu) return;

    menu.addEventListener('click', () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('nav-toggle');
    });

    // Close navbar when clicking on a link
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('fa-times');
            navbar.classList.remove('nav-toggle');
        });
    });

    // Close navbar when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('header') && navbar.classList.contains('nav-toggle')) {
            menu.classList.remove('fa-times');
            navbar.classList.remove('nav-toggle');
        }
    });
}

// Enhanced Mobile Menu
function setupMobileMenu() {
    const navLinks = document.querySelectorAll('.navbar ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Debug helper (for development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Portfolio Enhanced Features Loaded Successfully');
    console.log('Features: Form Validation, Scroll Animations, Performance Monitoring, Lazy Loading');
}

// Export classes for potential reuse
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FormValidator, ScrollReveal, SmoothScroll, PerformanceMonitor, LazyLoadImages };
}
