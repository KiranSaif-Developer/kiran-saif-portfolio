// ===================================================================
// EXPERIENCE DATA — single source of truth for experience.html + admin.html
// ===================================================================

const EXPERIENCE_STORAGE_KEY = 'portfolio_experience';

function getDefaultExperience() {
    return [
        {
            id: 'edu-cs-degree',
            column: 'education',
            title: 'BS Computer Science',
            company: '',
            duration: '2023 - 2028',
            bullets: [
                'Undergraduate degree focused on programming fundamentals, data structures, algorithms, and modern web technologies.'
            ]
        },
        {
            id: 'exp-wordpress-codethinker',
            column: 'experience',
            title: 'WordPress Developer',
            company: 'Code Thinker',
            duration: 'July 2026 - Present',
            bullets: [
                'Building and maintaining custom WordPress websites and WooCommerce stores.',
                'Focused on clean UI, performance, and conversions.'
            ]
        },
        {
    id: 'exp-fullstack-vartexsoft',
    column: 'experience',
    title: 'Full Stack Engineer',
    company: 'Vartex Soft (Remote)',
    duration: 'Jul 2026 – Aug 2026',
    bullets: [
        'Built and maintained web applications using Node.js, JavaScript, and PostgreSQL.',
        'Collaborated with the team on real-world client projects, from planning to deployment.'
    ]
},
        {
            id: 'exp-social-cyntik',
            column: 'experience',
            title: 'Social Media Marketing',
            company: 'Cyntik',
            duration: 'Oct 2024 - Dec 2024',
            bullets: [
                'Planned and managed social media content and campaigns.',
                'Drove audience engagement and brand visibility.'
            ]
        },
        {
            id: 'exp-leadgen',
            column: 'experience',
            title: 'Lead Generation Expert',
            company: '',
            duration: 'June 2022 - Feb 2023',
            bullets: [
                'Generated and qualified leads through targeted outreach.',
                'Supported sales pipeline growth for clients.'
            ]
        }
    ];
}

function ensureExperienceSeeded() {
    if (!localStorage.getItem(EXPERIENCE_STORAGE_KEY)) {
        localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(getDefaultExperience()));
    }
}

function getExperience() {
    ensureExperienceSeeded();
    return JSON.parse(localStorage.getItem(EXPERIENCE_STORAGE_KEY)) || [];
}

function saveExperience(list) {
    localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(list));
}
