// ===================================================================
// CERTIFICATIONS DATA — single source of truth for certifications.html + admin.html
// ===================================================================

const CERTS_STORAGE_KEY = 'portfolio_certs';

function getDefaultCerts() {
    return [
        {
            id: 'cert-fullstack-meta',
            title: 'Professional Full-Stack Developer Certificate',
            issuer: 'Meta & Coursera Professional Program',
            category: 'development',
            date: 'July 2025',
            keySkills: ['Full-Stack Web Development', 'API Design', 'React'],
            verifyLink: '#',
            image: 'https://picsum.photos/seed/kscert1/600/400'
        },
        {
            id: 'cert-wordpress-architect',
            title: 'Advanced Custom WordPress Architect',
            issuer: 'WP Developer Alliance',
            category: 'wordpress',
            date: 'December 2024',
            keySkills: ['Theme Architecture', 'WooCommerce', 'Plugin Development'],
            verifyLink: '#',
            image: 'https://picsum.photos/seed/kscert2/600/400'
        },
        {
            id: 'cert-database-specialist',
            title: 'Database Design & Relational Query Specialist',
            issuer: 'MySQL Academy',
            category: 'database',
            date: 'March 2024',
            keySkills: ['Relational Schemas', 'Query Optimization', 'Indexing'],
            verifyLink: '#',
            image: 'https://picsum.photos/seed/kscert3/600/400'
        }
    ];
}

function ensureCertsSeeded() {
    if (!localStorage.getItem(CERTS_STORAGE_KEY)) {
        localStorage.setItem(CERTS_STORAGE_KEY, JSON.stringify(getDefaultCerts()));
    }
}

function getCerts() {
    ensureCertsSeeded();
    return JSON.parse(localStorage.getItem(CERTS_STORAGE_KEY)) || [];
}

function saveCerts(list) {
    localStorage.setItem(CERTS_STORAGE_KEY, JSON.stringify(list));
}

function categoryLabel(slug) {
    const labels = { development: 'Development', wordpress: 'WordPress', database: 'Databases' };
    return labels[slug] || slug;
}
