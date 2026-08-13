// ===================================================================
// Kiran Saif Portfolio — COMMON.JS
// Loaded on every page. Handles: data seeding, theme, preloader,
// mobile nav, CV link injection, hidden admin trigger.
// Page-specific logic (projects.js, tips.js, etc.) hooks in via the
// optional global `initPage()` function — define it in the page's own
// script BEFORE this file's DOMContentLoaded runs, and common.js will
// call it automatically once the preloader finishes.
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    seedInitialData();
    initThemeController();
    renderCVLinks();

    runPreloader(() => {
        initMobileNavigation();
        initHiddenAdminTrigger();
        initStickyNavbar();

        // Hook for page-specific init (defined in home.js / projects.js / etc.)
        if (typeof initPage === 'function') {
            initPage();
        }
    });
});

// -------------------------------------------------------------
// Seed default data if LocalStorage is empty (unchanged from original)
// -------------------------------------------------------------
function seedInitialData() {
    const defaultProjects = [
        { id: 'proj-1', title: 'ChatNex (AI Application)', description: 'Advanced AI-driven growth application specializing in conversational interfaces, customer service automations, and intelligent routing.', tech: 'React, API Integration, Node.js', url: 'https://chatnex-business-growth-ai-n8fb.vercel.app/', sourceCode: '' },
        { id: 'proj-2', title: 'EchoBeats Web Application', description: 'Immersive audio streaming platform featuring rich visualizers, audio processing pipelines, and stateful playlist management.', tech: 'JavaScript, Web Audio API, CSS Grid', url: 'https://echobeats-g4d1.vercel.app/', sourceCode: '' },
        { id: 'proj-3', title: 'RoyalEvent Halls System', description: 'Comprehensive software layout for booking event halls, managing catering selections, scheduling, and database persistence.', tech: 'React, Node.js, MySQL', url: '', sourceCode: 'https://github.com/KiranSaif-Developer/RoyalEvent-Halls-System' },
        { id: 'proj-4', title: 'Velvet Rose', description: 'Elegant e-commerce storefront utilizing custom WordPress APIs and database schemas, designed to drive local and international sales.', tech: 'WordPress, PHP, Custom CSS', url: '', sourceCode: 'https://github.com/KiranSaif-Developer/Velvet-Rose' },
        { id: 'proj-5', title: 'Bites & Burgers', description: 'Interactive restaurant landing platform built with heavy emphasis on micro-interactions, responsive grids, and checkout navigation.', tech: 'HTML5, CSS3, JavaScript', url: 'https://kiransaif-developer.github.io/bites-and-burgers/', sourceCode: '' },
        { id: 'proj-6', title: 'Custom Corporate WordPress Site', description: 'Corporate portal built using lightweight clean theme structures, bespoke content structures, custom styling, and optimized load cycles.', tech: 'WordPress, Custom CSS, PHP', url: '#', sourceCode: '#' },
        { id: 'proj-7', title: 'E-Commerce WordPress Store', description: 'E-commerce interface custom built with WooCommerce API endpoints, flexible product categories, cart triggers, and secure checkout frameworks.', tech: 'WordPress, WooCommerce, MySQL', url: '#', sourceCode: '#' }
    ];

    // defaultCerts removed — see js/certifications-data.js for the new schema

    const defaultCV = '#';

    // NOTE: Tips and Certifications are no longer seeded here.
    // They each have their own dedicated data module now:
    //   - js/tips-data.js seeds 'portfolio_tips' (detailed schema: insight, code before/after, principles, quote)
    //   - js/certifications-data.js seeds 'portfolio_certs' (new schema, see that file)
    // Seeding them here too would silently create a conflicting schema under the same
    // localStorage key, and whichever ran first would "win" — so this file only owns
    // the data types that don't have their own module (Projects, CV).
    if (!localStorage.getItem('portfolio_projects')) localStorage.setItem('portfolio_projects', JSON.stringify(defaultProjects));
    if (!localStorage.getItem('portfolio_cv_link')) localStorage.setItem('portfolio_cv_link', defaultCV);
}

// -------------------------------------------------------------
// Theme Toggle Controller
// -------------------------------------------------------------
function initThemeController() {
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const savedTheme = localStorage.getItem('portfolio_theme');

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('portfolio_theme', isLight ? 'light' : 'dark');

            if (themeIcon) {
                themeIcon.classList.toggle('fa-moon', !isLight);
                themeIcon.classList.toggle('fa-sun', isLight);
            }
        });
    }
}

// -------------------------------------------------------------
// CV Link injection (nav button + about page button, if present)
// -------------------------------------------------------------
function renderCVLinks() {
    const cvLink = localStorage.getItem('portfolio_cv_link') || '#';
    const navCvBtn = document.getElementById('nav-cv-btn');
    const aboutCvBtn = document.getElementById('about-cv-btn');
    if (navCvBtn) navCvBtn.href = cvLink;
    if (aboutCvBtn) aboutCvBtn.href = cvLink;
}

// -------------------------------------------------------------
// Preloader Animation Counter
// -------------------------------------------------------------
function runPreloader(callback) {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('progress-fill');
    const counter = document.getElementById('progress-count');

    if (!preloader || !fill || !counter) {
        if (callback) callback();
        return;
    }

    let percent = 0;
    const interval = setInterval(() => {
        percent += 5;
        if (percent > 100) percent = 100;

        fill.style.width = percent + '%';
        counter.innerText = percent + '%';

        if (percent === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('fade-out');
                if (callback) callback();
            }, 200);
        }
    }, 15);
}

// -------------------------------------------------------------
// Sticky navbar shadow on scroll
// -------------------------------------------------------------
function initStickyNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
}

// -------------------------------------------------------------
// Mobile Hamburger Menu toggle controller
// -------------------------------------------------------------
function initMobileNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .btn-cv');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// -------------------------------------------------------------
// Double-click footer copyright -> navigate to admin.html
// NOTE: this is obscurity, not real security. Anyone reading this
// file (or View Source) can find admin.html. Don't rely on this
// as an access-control mechanism.
// -------------------------------------------------------------
function initHiddenAdminTrigger() {
    const copyrightText = document.getElementById('copyright-text');
    if (copyrightText) {
        copyrightText.addEventListener('dblclick', () => {
            navigateTo('admin.html');
        });
    }
}

function navigateTo(url) {
    window.location.href = url;
}

// -------------------------------------------------------------
// Utility to escape HTML variables for rendering securely
// -------------------------------------------------------------
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
