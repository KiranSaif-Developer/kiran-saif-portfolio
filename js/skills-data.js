// ===================================================================
// SKILLS DATA — single source of truth for skills.html + admin.html
// ===================================================================

const SKILLS_STORAGE_KEY = 'portfolio_skills';

function getDefaultSkillCategories() {
    return [
        {
            id: 'cat-languages',
            categoryName: 'Languages',
            categoryIcon: 'fa-solid fa-code',
            skills: [
                { name: 'Python', icon: 'fa-brands fa-python' },
                { name: 'HTML', icon: 'fa-brands fa-html5' },
                { name: 'CSS', icon: 'fa-brands fa-css3-alt' },
                { name: 'JavaScript', icon: 'fa-brands fa-js' },
                { name: 'Java', icon: 'fa-brands fa-java' },
                { name: 'C++', icon: 'fa-solid fa-terminal' },
                { name: 'PostgreSQL', icon: 'fa-solid fa-database' },
                { name: 'MySQL', icon: 'fa-solid fa-database' }
            ]
        },
        {
            id: 'cat-specialization',
            categoryName: 'Specialization',
            categoryIcon: 'fa-solid fa-star',
            skills: [
                { name: 'WordPress Developer', icon: 'fa-brands fa-wordpress' },
                { name: 'Full-Stack Developer', icon: 'fa-solid fa-laptop-code' },
                { name: 'API Integration', icon: 'fa-solid fa-network-wired' },
                { name: 'Lead Generation', icon: 'fa-solid fa-bullseye' },
                { name: 'Client Acquisition', icon: 'fa-solid fa-user-check' },
                { name: 'Social Media Marketing', icon: 'fa-solid fa-share-nodes' }
            ]
        },
        {
            id: 'cat-backend',
            categoryName: 'Backend Skills',
            categoryIcon: 'fa-solid fa-server',
            skills: [
                { name: 'API Integration', icon: 'fa-solid fa-gears' },
                { name: 'Node.js', icon: 'fa-brands fa-node-js' },
                { name: 'Authentication (JWT/OAuth)', icon: 'fa-solid fa-shield-halved' },
                { name: 'REST APIs', icon: 'fa-solid fa-link' },
                { name: 'Express.js', icon: 'fa-solid fa-bolt' }
            ]
        },
        {
            id: 'cat-databases',
            categoryName: 'Databases',
            categoryIcon: 'fa-solid fa-database',
            skills: [
                { name: 'PostgreSQL', icon: 'fa-solid fa-database' },
                { name: 'MySQL', icon: 'fa-solid fa-server' },
                { name: 'Supabase', icon: 'fa-solid fa-bolt' },
                { name: 'Neon DB', icon: 'fa-solid fa-cloud' }
            ]
        },
        {
            id: 'cat-tools',
            categoryName: 'Tools & Platforms',
            categoryIcon: 'fa-solid fa-screwdriver-wrench',
            skills: [
                { name: 'VS Code', icon: 'fa-solid fa-code' },
                { name: 'Android Studio', icon: 'fa-brands fa-android' },
                { name: 'GitHub', icon: 'fa-brands fa-github' },
                { name: 'Git', icon: 'fa-solid fa-code-branch' },
                { name: 'Vercel', icon: 'fa-solid fa-globe' },
                { name: 'Railway App', icon: 'fa-solid fa-cloud-arrow-up' },
                { name: 'CodeSandbox', icon: 'fa-solid fa-box-open' }
            ]
        },
        {
            id: 'cat-wordpress-dev',
            categoryName: 'WordPress Development',
            categoryIcon: 'fa-brands fa-wordpress-simple',
            skills: [
                { name: 'Elementor Customization', icon: 'fa-solid fa-cubes' },
                { name: 'WooCommerce', icon: 'fa-solid fa-cart-shopping' },
                { name: 'Astra & Divi Themes', icon: 'fa-solid fa-paintbrush' },
                { name: 'Blog Setup', icon: 'fa-solid fa-blog' },
                { name: 'Speed Optimization', icon: 'fa-solid fa-gauge-high' },
                { name: 'Security & Hack Recovery', icon: 'fa-solid fa-lock' }
            ]
        },
        {
            id: 'cat-soft-skills',
            categoryName: 'Professional & Soft Skills',
            categoryIcon: 'fa-solid fa-brain',
            skills: [
                { name: 'Problem Solving', icon: 'fa-solid fa-lightbulb' },
                { name: 'Communication Skills', icon: 'fa-solid fa-comments' },
                { name: 'Teamwork', icon: 'fa-solid fa-people-group' },
                { name: 'Creativity', icon: 'fa-solid fa-palette' },
                { name: 'Flexibility', icon: 'fa-solid fa-sliders' },
                { name: 'Time Management', icon: 'fa-solid fa-clock' },
                { name: 'Adaptability', icon: 'fa-solid fa-arrows-rotate' }
            ]
        }
    ];
}

function ensureSkillsSeeded() {
    if (!localStorage.getItem(SKILLS_STORAGE_KEY)) {
        localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(getDefaultSkillCategories()));
    }
}

function getSkillCategories() {
    ensureSkillsSeeded();
    return JSON.parse(localStorage.getItem(SKILLS_STORAGE_KEY)) || [];
}

function saveSkillCategories(list) {
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(list));
}
