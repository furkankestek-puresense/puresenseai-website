/* ===================================
   Pure Sense AI - Main JavaScript
   =================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initParallax();
    initFAQ();
    initWaitlistForm();
    initLanguageSwitcher();
    initDarkMode();
    initCookieBanner();
    initMicroInteractions();
    initScrollToTop();
    initExitPopup();
});

/**
 * Waitlist Form Submission with Formspree
 * Creates a free Formspree endpoint for email collection
 */
function initWaitlistForm() {
    const form = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('successMessage');

    // Formspree endpoint - Replace with your actual Formspree form ID
    // Create free form at: https://formspree.io/forms
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgowvppl';

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<span>Gönderiliyor...</span>';
            submitBtn.disabled = true;

            try {
                // Send to Formspree
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        source: 'Pure Sense AI Website',
                        timestamp: new Date().toISOString()
                    })
                });

                if (response.ok) {
                    // Show success message
                    form.style.display = 'none';
                    successMessage.style.display = 'block';

                    // Track with analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'waitlist_signup', {
                            method: 'email',
                            email_domain: email.split('@')[1]
                        });
                    }
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'Lead');
                    }

                    console.log('✅ Email registered successfully:', email);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('❌ Form submission error:', error);
                alert('Bir hata oluştu. Lütfen tekrar deneyin.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

/**
 * Navbar Scroll Effect
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    // Elements to animate on scroll with default fade-up
    const animatedElements = document.querySelectorAll(`
        .feature-card,
        .step,
        .tip-card,
        .about-text,
        .about-visual,
        .section-header,
        .highlight,
        .faq-item,
        .product-benefit,
        .showcase-card,
        .partner-card
    `);

    // Add initial hidden state
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Create observer with staggered animation per visible group
    const observer = new IntersectionObserver((entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        visibleEntries.forEach((entry, index) => {
            // Stagger animation delay within visible group
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 80);

            // Unobserve after animation
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe all elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Slide-in from left for feature icons
    const slideLeftElements = document.querySelectorAll('.benefit-icon, .step-icon-wrapper');
    slideLeftElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-30px) scale(0.8)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0) scale(1)';
                slideObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    slideLeftElements.forEach(el => slideObserver.observe(el));

    // Scale-in animation for phone mockups
    const scaleElements = document.querySelectorAll('.phone-mockup, .about-phone');
    scaleElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.9)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    const scaleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
                scaleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    scaleElements.forEach(el => scaleObserver.observe(el));

    // Blur-in effect for section badges
    const badgeElements = document.querySelectorAll('.section-badge, .coming-soon-badge');
    badgeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.filter = 'blur(10px)';
        el.style.transform = 'translateY(-10px)';
        el.style.transition = 'opacity 0.6s ease, filter 0.6s ease, transform 0.6s ease';
    });

    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.filter = 'blur(0)';
                entry.target.style.transform = 'translateY(0)';
                badgeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    badgeElements.forEach(el => badgeObserver.observe(el));
}

/**
 * Parallax Effect for Blobs
 */
function initParallax() {
    const blobs = document.querySelectorAll('.blob');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 10;
            blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

/**
 * Counter Animation for Stats
 */
function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, stepTime);
}

/**
 * Intersection Observer for Stat Counters
 */
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const text = target.textContent;

            if (text.includes('K+')) {
                animateCounter(target, 50, 'K+');
            } else if (text.includes('%')) {
                animateCounter(target, 99, '%');
            } else if (text.includes('.')) {
                // For rating like 4.9
                const ratingElement = target;
                let current = 0;
                const targetRating = 4.9;
                const increment = targetRating / 30;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetRating) {
                        current = targetRating;
                        clearInterval(timer);
                    }
                    ratingElement.textContent = current.toFixed(1);
                }, 50);
            }

            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

/**
 * Typing Effect for Hero Title (Optional)
 */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/**
 * Add ripple effect to buttons
 */
document.querySelectorAll('.btn, .store-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();

        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            left: ${e.clientX - rect.left}px;
            top: ${e.clientY - rect.top}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * Lazy Loading for Images
 */
document.querySelectorAll('img[data-src]').forEach(img => {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src;
                image.removeAttribute('data-src');
                imageObserver.unobserve(image);
            }
        });
    });

    imageObserver.observe(img);
});

/**
 * Language Switcher
 */
let translations = {};
let currentLang = localStorage.getItem('puresense_lang') || 'tr';

async function initLanguageSwitcher() {
    try {
        const response = await fetch('js/translations.json');
        translations = await response.json();
        applyLanguage(currentLang);
    } catch (error) {
        console.log('Translations not loaded, using defaults');
    }

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'tr' ? 'en' : 'tr';
            localStorage.setItem('puresense_lang', currentLang);
            applyLanguage(currentLang);
            updateLangToggleUI();
        });
    }
    updateLangToggleUI();
}

function updateLangToggleUI() {
    const langFlag = document.querySelector('.lang-flag');
    const langCode = document.querySelector('.lang-code');
    if (langFlag && langCode) {
        langFlag.textContent = currentLang === 'tr' ? '🇹🇷' : '🇬🇧';
        langCode.textContent = currentLang.toUpperCase();
    }
    document.documentElement.lang = currentLang;
}

function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = t;
        for (const k of keys) {
            if (value && value[k]) value = value[k];
            else { value = null; break; }
        }
        if (value) {
            if (el.placeholder !== undefined && el.tagName === 'INPUT') {
                el.placeholder = value;
            } else {
                el.textContent = value;
            }
        }
    });
}

/**
 * Dark Mode
 */
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('puresense_theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcons(true);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('puresense_theme', isDark ? 'dark' : 'light');
            updateThemeIcons(isDark);
        });
    }
}

function updateThemeIcons(isDark) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    if (sunIcon && moonIcon) {
        sunIcon.style.display = isDark ? 'none' : 'block';
        moonIcon.style.display = isDark ? 'block' : 'none';
    }
}

/**
 * Cookie Banner (KVKK Compliant)
 */
function initCookieBanner() {
    const consent = localStorage.getItem('puresense_cookie_consent');

    if (!consent) {
        createCookieBanner();
    }
}

function createCookieBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <div class="cookie-text">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <p>Bu site, deneyiminizi geliştirmek için çerezler kullanmaktadır. 
                   <a href="privacy.html" target="_blank">Gizlilik Politikası</a></p>
            </div>
            <div class="cookie-actions">
                <button class="cookie-btn cookie-decline" id="cookieDecline">Reddet</button>
                <button class="cookie-btn cookie-accept" id="cookieAccept">Kabul Et</button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);

    // Add animation delay
    setTimeout(() => banner.classList.add('show'), 500);

    document.getElementById('cookieAccept').addEventListener('click', () => {
        localStorage.setItem('puresense_cookie_consent', 'accepted');
        hideCookieBanner(banner);
    });

    document.getElementById('cookieDecline').addEventListener('click', () => {
        localStorage.setItem('puresense_cookie_consent', 'declined');
        hideCookieBanner(banner);
    });
}

function hideCookieBanner(banner) {
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 300);
}

/**
 * Enhanced Micro-Interactions
 */
function initMicroInteractions() {
    // Card hover depth effect
    document.querySelectorAll('.feature-card, .step, .tip-card, .showcase-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Button magnetic effect
    document.querySelectorAll('.btn, .nav-cta, .store-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Text reveal on scroll
    document.querySelectorAll('.section-title, .hero-title').forEach(title => {
        title.style.backgroundSize = '0% 100%';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        title.style.backgroundSize = '100% 100%';
                    }, 200);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(title);
    });

    // Progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });
}

/**
 * A/B Testing Manager
 * Enables testing different variations of CTAs, colors, and text
 */
const ABTestManager = {
    tests: {},

    // Initialize a test with variants
    init(testName, variants, options = {}) {
        // Check if user has existing assignment
        let assignment = localStorage.getItem(`ab_${testName}`);

        if (!assignment || options.forceNew) {
            // Randomly assign user to a variant
            const randomIndex = Math.floor(Math.random() * variants.length);
            assignment = variants[randomIndex].id;
            localStorage.setItem(`ab_${testName}`, assignment);

            // Log assignment event
            this.track(testName, 'assigned', assignment);
        }

        this.tests[testName] = {
            variants,
            assignment,
            conversions: parseInt(localStorage.getItem(`ab_${testName}_conv`) || '0')
        };

        return assignment;
    },

    // Get current variant for a test
    getVariant(testName) {
        return this.tests[testName]?.assignment || null;
    },

    // Apply variant to elements
    applyVariant(testName, elementSelector, property) {
        const test = this.tests[testName];
        if (!test) return;

        const variant = test.variants.find(v => v.id === test.assignment);
        if (!variant) return;

        const elements = document.querySelectorAll(elementSelector);
        elements.forEach(el => {
            if (property === 'text') {
                el.textContent = variant.value;
            } else if (property === 'color') {
                el.style.backgroundColor = variant.value;
            } else if (property === 'class') {
                el.classList.add(variant.value);
            } else if (property === 'html') {
                el.innerHTML = variant.value;
            }
        });
    },

    // Track conversion
    trackConversion(testName) {
        if (!this.tests[testName]) return;

        this.tests[testName].conversions++;
        localStorage.setItem(`ab_${testName}_conv`, this.tests[testName].conversions);
        this.track(testName, 'conversion', this.tests[testName].assignment);
    },

    // Track any event
    track(testName, eventType, variant) {
        const event = {
            test: testName,
            type: eventType,
            variant,
            timestamp: new Date().toISOString(),
            url: window.location.pathname
        };

        // Store locally
        const events = JSON.parse(localStorage.getItem('ab_events') || '[]');
        events.push(event);
        // Keep only last 100 events
        if (events.length > 100) events.shift();
        localStorage.setItem('ab_events', JSON.stringify(events));

        // Log to console for debugging
        console.log('📊 A/B Event:', event);

        // Optional: Send to analytics endpoint
        // fetch('/api/ab-track', { method: 'POST', body: JSON.stringify(event) });
    },

    // Get test statistics
    getStats(testName) {
        const events = JSON.parse(localStorage.getItem('ab_events') || '[]');
        const testEvents = events.filter(e => e.test === testName);

        const stats = {};
        testEvents.forEach(e => {
            if (!stats[e.variant]) {
                stats[e.variant] = { assigned: 0, conversions: 0 };
            }
            if (e.type === 'assigned') stats[e.variant].assigned++;
            if (e.type === 'conversion') stats[e.variant].conversions++;
        });

        return stats;
    }
};

// Example A/B test setup (commented out - uncomment to enable)
/*
document.addEventListener('DOMContentLoaded', function() {
    // Test different CTA texts
    ABTestManager.init('hero-cta', [
        { id: 'variant-a', value: 'Hemen İndir' },
        { id: 'variant-b', value: 'Ücretsiz Dene' },
        { id: 'variant-c', value: 'Şimdi Başla' }
    ]);
    ABTestManager.applyVariant('hero-cta', '.nav-cta', 'text');
    
    // Test different button colors
    ABTestManager.init('cta-color', [
        { id: 'pink', value: 'linear-gradient(135deg, #FE83C6 0%, #8B5CF6 100%)' },
        { id: 'blue', value: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' },
        { id: 'green', value: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }
    ]);
    
    // Track conversions on form submit
    document.getElementById('waitlistForm')?.addEventListener('submit', () => {
        ABTestManager.trackConversion('hero-cta');
        ABTestManager.trackConversion('cta-color');
    });
});
*/

// Expose for console access
window.ABTestManager = ABTestManager;

/**
 * Scroll to Top Button
 */
function initScrollToTop() {
    // Create button element
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    scrollBtn.setAttribute('aria-label', 'Yukarı kaydır');
    document.body.appendChild(scrollBtn);

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Exit Intent Popup
 */
function initExitPopup() {
    const popup = document.getElementById('exit-popup');
    if (!popup) return;

    const overlay = popup.querySelector('.exit-popup-overlay');
    const closeBtn = popup.querySelector('.exit-popup-close');
    const form = popup.querySelector('#exit-popup-form');
    const STORAGE_KEY = 'puresense_exit_popup_shown';

    // Check if already shown in this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let shown = false;

    // Show popup when mouse leaves viewport (exit intent)
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 10 && !shown) {
            showPopup();
        }
    });

    function showPopup() {
        shown = true;
        sessionStorage.setItem(STORAGE_KEY, 'true');
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hidePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close handlers
    closeBtn?.addEventListener('click', hidePopup);
    overlay?.addEventListener('click', hidePopup);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            hidePopup();
        }
    });

    // Form submission with Formspree
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgowvppl';

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        const submitBtn = form.querySelector('button[type="submit"]');

        // Show loading
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Gönderiliyor...';
        }

        try {
            // Send to Formspree
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    source: 'Exit Popup',
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                // Track with analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'popup_signup', { email_domain: email.split('@')[1] });
                }
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead');
                }

                // Show success message
                popup.querySelector('.exit-popup-content').innerHTML = `
                    <div class="exit-popup-icon">✨</div>
                    <h3 class="exit-popup-title">Teşekkürler!</h3>
                    <p class="exit-popup-desc">Bekleme listesine eklendiniz. Çok yakında haberlerimizi alacaksınız!</p>
                    <button class="exit-popup-btn" onclick="this.closest('.exit-popup').classList.remove('active'); document.body.style.overflow = '';">Tamam</button>
                `;

                console.log('✅ Exit popup signup:', email);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('❌ Exit popup error:', error);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Listeme Katıl';
            }
        }
    });
}

console.log('🎨 Pure Sense AI Website Loaded Successfully!');
