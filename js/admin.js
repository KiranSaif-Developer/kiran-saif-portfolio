// ===================================================================
// ADMIN PANEL — login, tabs, generic CRUD modal, export/import
// ===================================================================

const ADMIN_PASSWORD = 'kiransaif2026'; // change this to whatever you like
const ADMIN_SESSION_KEY = 'admin_session_authed';

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ---------------------------------------------------------------
// LOGIN GATE
// ---------------------------------------------------------------
function initLoginGate() {
    const loginScreen = document.getElementById('admin-login-screen');
    const dashboard = document.getElementById('admin-dashboard');
    const passwordInput = document.getElementById('admin-password-input');
    const loginBtn = document.getElementById('admin-login-btn');
    const errorMsg = document.getElementById('admin-login-error');

    function unlock() {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'flex';
        renderAllTabs();
    }

    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
        unlock();
        return;
    }

    function tryLogin() {
        if (passwordInput.value === ADMIN_PASSWORD) {
            sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
            unlock();
        } else {
            errorMsg.style.display = 'block';
        }
    }

    loginBtn.addEventListener('click', tryLogin);
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') tryLogin();
    });
}

// ---------------------------------------------------------------
// SIDEBAR TAB SWITCHING
// ---------------------------------------------------------------
function initTabs() {
    const navBtns = document.querySelectorAll('.admin-nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.admin-tab-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === `tab-${tabId}`);
            });
        });
    });
}

// ---------------------------------------------------------------
// GENERIC MODAL FORM
// ---------------------------------------------------------------
let currentModalConfig = null;

function buildFieldHTML(field, value) {
    const val = value !== undefined && value !== null ? value : (field.default || '');

    if (field.type === 'select') {
        const optionsHTML = field.options.map(opt =>
            `<option value="${escapeHTML(opt.value)}" ${opt.value === val ? 'selected' : ''}>${escapeHTML(opt.label)}</option>`
        ).join('');
        return `
            <div class="admin-field">
                <label>${escapeHTML(field.label)}</label>
                <select data-field="${field.key}">${optionsHTML}</select>
            </div>`;
    }

    if (field.type === 'textarea') {
        return `
            <div class="admin-field">
                <label>${escapeHTML(field.label)}</label>
                <textarea data-field="${field.key}" placeholder="${escapeHTML(field.placeholder || '')}">${escapeHTML(val)}</textarea>
                ${field.hint ? `<p class="admin-field-hint">${escapeHTML(field.hint)}</p>` : ''}
            </div>`;
    }

    return `
        <div class="admin-field">
            <label>${escapeHTML(field.label)}</label>
            <input type="text" data-field="${field.key}" value="${escapeHTML(val)}" placeholder="${escapeHTML(field.placeholder || '')}">
            ${field.hint ? `<p class="admin-field-hint">${escapeHTML(field.hint)}</p>` : ''}
        </div>`;
}

function openModal(config) {
    currentModalConfig = config;
    document.getElementById('admin-modal-title').textContent = config.title;

    const body = document.getElementById('admin-modal-body');
    body.innerHTML = config.fields.map(f => buildFieldHTML(f, config.values ? config.values[f.key] : undefined)).join('');

    document.getElementById('admin-modal-overlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('admin-modal-overlay').style.display = 'none';
    currentModalConfig = null;
}

function readModalValues() {
    const values = {};
    currentModalConfig.fields.forEach(f => {
        const el = document.querySelector(`[data-field="${f.key}"]`);
        values[f.key] = el ? el.value : '';
    });
    return values;
}

function initModal() {
    document.getElementById('admin-modal-close').addEventListener('click', closeModal);
    document.getElementById('admin-modal-cancel').addEventListener('click', closeModal);
    document.getElementById('admin-modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'admin-modal-overlay') closeModal();
    });
    document.getElementById('admin-modal-save').addEventListener('click', () => {
        if (currentModalConfig && currentModalConfig.onSave) {
            const values = readModalValues();
            currentModalConfig.onSave(values);
            closeModal();
        }
    });
}

// ---------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------
const PROJECT_FIELDS = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'tech', label: 'Tech Tags', hint: 'Comma-separated, e.g. React, Node.js, MongoDB. Include "WordPress" or "WooCommerce" to auto-categorize as WordPress.' },
    { key: 'url', label: 'Live Demo URL', placeholder: 'https://... or leave blank' },
    { key: 'sourceCode', label: 'Source Code URL', placeholder: 'https://github.com/...' },
    { key: 'image', label: 'Preview Image URL (optional)', hint: 'If left blank, a screenshot preview is auto-generated from the Live Demo URL.' }
];

function renderProjectsList() {
    const list = document.getElementById('list-projects');
    const projects = getProjectsAdmin();
    list.innerHTML = '';

    if (projects.length === 0) {
        list.innerHTML = `<div class="admin-empty-row">No projects yet. Click "Add Project" to create one.</div>`;
        return;
    }

    projects.forEach((p, idx) => {
        list.insertAdjacentHTML('beforeend', `
            <div class="admin-list-row">
                <div class="admin-list-row-info">
                    <p class="admin-list-row-title">${escapeHTML(p.title)}</p>
                    <p class="admin-list-row-meta">${escapeHTML(p.tech || '')}</p>
                </div>
                <div class="admin-list-row-actions">
                    <button class="admin-icon-btn" data-edit="projects" data-index="${idx}"><i class="fa-solid fa-pen"></i></button>
                    <button class="admin-icon-btn danger" data-delete="projects" data-index="${idx}"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`);
    });
}

function openProjectForm(index) {
    const projects = getProjectsAdmin();
    const isEdit = index !== undefined;
    const values = isEdit ? projects[index] : {};

    openModal({
        title: isEdit ? 'Edit Project' : 'Add Project',
        fields: PROJECT_FIELDS,
        values,
        onSave: (newValues) => {
            const list = getProjectsAdmin();
            if (isEdit) {
                list[index] = { ...list[index], ...newValues };
            } else {
                newValues.id = 'project-' + Date.now();
                list.push(newValues);
            }
            saveProjectsAdmin(list);
            renderProjectsList();
        }
    });
}

// ---------------------------------------------------------------
// TIPS
// ---------------------------------------------------------------
const TIP_FIELDS = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', placeholder: 'e.g. Clean Code, React, Python' },
    { key: 'date', label: 'Date', placeholder: 'YYYY-MM-DD' },
    { key: 'readTime', label: 'Read Time', placeholder: 'e.g. 3 min read' },
    { key: 'excerpt', label: 'Excerpt (card preview text)', type: 'textarea' },
    { key: 'insight', label: 'Core Insight', type: 'textarea' },
    { key: 'codeBeforeLabel', label: '"Before" Code Label', placeholder: 'e.g. Deeply Nested (Hard to Read)' },
    { key: 'codeBefore', label: '"Before" Code', type: 'textarea' },
    { key: 'codeAfterLabel', label: '"After" Code Label', placeholder: 'e.g. Early Returns (Clean)' },
    { key: 'codeAfter', label: '"After" Code', type: 'textarea' },
    { key: 'whyMatters', label: 'Why This Matters', type: 'textarea' },
    { key: 'principles', label: 'Key Principles', type: 'textarea', hint: 'One principle per line.' },
    { key: 'quote', label: 'Sidebar Quote', type: 'textarea' },
    { key: 'quoteAuthor', label: 'Quote Attribution', placeholder: 'e.g. Clean code principle' },
    { key: 'author', label: 'Author', placeholder: 'Kiran Saif' }
];

function renderTipsList() {
    const list = document.getElementById('list-tips');
    const tips = getTips();
    list.innerHTML = '';

    if (tips.length === 0) {
        list.innerHTML = `<div class="admin-empty-row">No tips yet. Click "Add Tip" to create one.</div>`;
        return;
    }

    tips.forEach((t, idx) => {
        list.insertAdjacentHTML('beforeend', `
            <div class="admin-list-row">
                <div class="admin-list-row-info">
                    <p class="admin-list-row-title">${escapeHTML(t.title)}</p>
                    <p class="admin-list-row-meta">${escapeHTML(t.category)} · ${escapeHTML(t.date || '')}</p>
                </div>
                <div class="admin-list-row-actions">
                    <button class="admin-icon-btn" data-edit="tips" data-index="${idx}"><i class="fa-solid fa-pen"></i></button>
                    <button class="admin-icon-btn danger" data-delete="tips" data-index="${idx}"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`);
    });
}

function openTipForm(index) {
    const tips = getTips();
    const isEdit = index !== undefined;
    const values = isEdit ? { ...tips[index], principles: (tips[index].principles || []).join('\n') } : {};

    openModal({
        title: isEdit ? 'Edit Tip' : 'Add Tip',
        fields: TIP_FIELDS,
        values,
        onSave: (newValues) => {
            const list = getTips();
            newValues.principles = newValues.principles.split('\n').map(s => s.trim()).filter(Boolean);
            if (isEdit) {
                list[index] = { ...list[index], ...newValues };
            } else {
                newValues.id = 'tip-' + Date.now();
                list.push(newValues);
            }
            localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(list));
            renderTipsList();
        }
    });
}

// ---------------------------------------------------------------
// EXPERIENCE
// ---------------------------------------------------------------
const EXPERIENCE_FIELDS = [
    { key: 'column', label: 'Section', type: 'select', options: [
        { value: 'education', label: 'Education' },
        { value: 'experience', label: 'Experience' }
    ] },
    { key: 'title', label: 'Title / Degree / Role' },
    { key: 'company', label: 'Company / Institution (optional)' },
    { key: 'duration', label: 'Duration', placeholder: 'e.g. 2024 - Present' },
    { key: 'bullets', label: 'Description Points', type: 'textarea', hint: 'One bullet per line.' }
];

function renderExperienceList() {
    const list = document.getElementById('list-experience');
    const items = getExperience();
    list.innerHTML = '';

    if (items.length === 0) {
        list.innerHTML = `<div class="admin-empty-row">No entries yet. Click "Add Entry" to create one.</div>`;
        return;
    }

    items.forEach((item, idx) => {
        list.insertAdjacentHTML('beforeend', `
            <div class="admin-list-row">
                <div class="admin-list-row-info">
                    <p class="admin-list-row-title">${escapeHTML(item.title)} <span style="color:var(--text-muted); font-weight:400;">(${escapeHTML(item.column)})</span></p>
                    <p class="admin-list-row-meta">${escapeHTML(item.company || '')} ${item.company ? '·' : ''} ${escapeHTML(item.duration)}</p>
                </div>
                <div class="admin-list-row-actions">
                    <button class="admin-icon-btn" data-edit="experience" data-index="${idx}"><i class="fa-solid fa-pen"></i></button>
                    <button class="admin-icon-btn danger" data-delete="experience" data-index="${idx}"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`);
    });
}

function openExperienceForm(index) {
    const items = getExperience();
    const isEdit = index !== undefined;
    const values = isEdit ? { ...items[index], bullets: (items[index].bullets || []).join('\n') } : { column: 'experience' };

    openModal({
        title: isEdit ? 'Edit Entry' : 'Add Entry',
        fields: EXPERIENCE_FIELDS,
        values,
        onSave: (newValues) => {
            const list = getExperience();
            newValues.bullets = newValues.bullets.split('\n').map(s => s.trim()).filter(Boolean);
            if (isEdit) {
                list[index] = { ...list[index], ...newValues };
            } else {
                newValues.id = 'exp-' + Date.now();
                list.push(newValues);
            }
            saveExperience(list);
            renderExperienceList();
        }
    });
}

// ---------------------------------------------------------------
// SKILLS (category-level rows; skills list edited as "Name | icon" lines)
// ---------------------------------------------------------------
const SKILLS_FIELDS = [
    { key: 'categoryName', label: 'Category Name', placeholder: 'e.g. Languages' },
    { key: 'categoryIcon', label: 'Category Icon', placeholder: 'e.g. fa-solid fa-code', hint: 'A Font Awesome class name.' },
    { key: 'skillsRaw', label: 'Skills', type: 'textarea', hint: 'One skill per line, format: Name | fa-icon-class (e.g. Python | fa-brands fa-python)' }
];

function renderSkillsList() {
    const list = document.getElementById('list-skills');
    const categories = getSkillCategories();
    list.innerHTML = '';

    if (categories.length === 0) {
        list.innerHTML = `<div class="admin-empty-row">No skill categories yet. Click "Add Category" to create one.</div>`;
        return;
    }

    categories.forEach((cat, idx) => {
        const chips = (cat.skills || []).map(s => `<span class="admin-skill-badge-chip">${escapeHTML(s.name)}</span>`).join('');
        list.insertAdjacentHTML('beforeend', `
            <div class="admin-list-row" style="align-items:flex-start;">
                <div class="admin-list-row-info">
                    <p class="admin-list-row-title">${escapeHTML(cat.categoryName)}</p>
                    <div class="admin-skill-badges">${chips}</div>
                </div>
                <div class="admin-list-row-actions">
                    <button class="admin-icon-btn" data-edit="skills" data-index="${idx}"><i class="fa-solid fa-pen"></i></button>
                    <button class="admin-icon-btn danger" data-delete="skills" data-index="${idx}"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`);
    });
}

function openSkillsForm(index) {
    const categories = getSkillCategories();
    const isEdit = index !== undefined;
    const skillsRaw = isEdit ? (categories[index].skills || []).map(s => `${s.name} | ${s.icon}`).join('\n') : '';
    const values = isEdit ? { ...categories[index], skillsRaw } : {};

    openModal({
        title: isEdit ? 'Edit Skill Category' : 'Add Skill Category',
        fields: SKILLS_FIELDS,
        values,
        onSave: (newValues) => {
            const list = getSkillCategories();
            const skills = newValues.skillsRaw.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
                const [name, icon] = line.split('|').map(s => s.trim());
                return { name: name || line, icon: icon || 'fa-solid fa-star' };
            });
            const entry = { categoryName: newValues.categoryName, categoryIcon: newValues.categoryIcon, skills };

            if (isEdit) {
                list[index] = { ...list[index], ...entry };
            } else {
                entry.id = 'cat-' + Date.now();
                list.push(entry);
            }
            saveSkillCategories(list);
            renderSkillsList();
        }
    });
}

// ---------------------------------------------------------------
// CERTIFICATIONS
// ---------------------------------------------------------------
const CERT_FIELDS = [
    { key: 'title', label: 'Certificate Title' },
    { key: 'issuer', label: 'Issuer' },

    // Category — user can type anything
    {
        key: 'category',
        label: 'Category',
        type: 'text',
        placeholder: 'e.g. Development, WordPress, SEO'
    },

    { key: 'date', label: 'Date', placeholder: 'e.g. July 2025' },

    {
        key: 'keySkillsRaw',
        label: 'Key Skills',
        hint: 'Comma-separated, e.g. React, API Design, Testing'
    },

    {
        key: 'verifyLink',
        label: 'Verify Link URL',
        placeholder: 'https://...'
    },

    {
        key: 'image',
        label: 'Certificate Image URL',
        hint: 'Paste an image URL. File uploads aren’t supported on a static site — see note below.'
    }
];


function renderCertificationsList() {
    const list = document.getElementById('list-certifications');
    const certs = getCerts();

    list.innerHTML = '';

    if (certs.length === 0) {
        list.innerHTML = `
            <div class="admin-empty-row">
                No certifications yet. Click "Add Certification" to create one.
            </div>
        `;
        return;
    }

    certs.forEach((c, idx) => {
        list.insertAdjacentHTML('beforeend', `
            <div class="admin-list-row">
                <div class="admin-list-row-info">
                    <p class="admin-list-row-title">
                        ${escapeHTML(c.title)}
                    </p>

                    <p class="admin-list-row-meta">
                        ${escapeHTML(c.issuer)}
                        ·
                        ${escapeHTML(c.category || '')}
                        ·
                        ${escapeHTML(c.date || '')}
                    </p>
                </div>

                <div class="admin-list-row-actions">
                    <button
                        class="admin-icon-btn"
                        data-edit="certifications"
                        data-index="${idx}"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="admin-icon-btn danger"
                        data-delete="certifications"
                        data-index="${idx}"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `);
    });
}


function openCertificationForm(index) {
    const certs = getCerts();
    const isEdit = index !== undefined;

    const keySkillsRaw = isEdit
        ? (certs[index].keySkills || []).join(', ')
        : '';

    // New certification starts with an empty category
    // so user can type it manually.
    const values = isEdit
        ? {
            ...certs[index],
            keySkillsRaw
        }
        : {
            category: ''
        };


    openModal({
        title: isEdit ? 'Edit Certification' : 'Add Certification',

        fields: CERT_FIELDS,

        values,

        onSave: (newValues) => {
            const list = getCerts();

            newValues.keySkills = newValues.keySkillsRaw
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);

            delete newValues.keySkillsRaw;


            if (isEdit) {
                list[index] = {
                    ...list[index],
                    ...newValues
                };
            } else {
                newValues.id = 'cert-' + Date.now();
                list.push(newValues);
            }


            saveCerts(list);
            renderCertificationsList();
        }
    });
}
// ---------------------------------------------------------------
// CV LINK
// ---------------------------------------------------------------
function initCVTab() {
    const input = document.getElementById('cv-link-input');
    const saveBtn = document.getElementById('cv-save-btn');
    const confirmMsg = document.getElementById('cv-save-confirm');

    input.value = localStorage.getItem('portfolio_cv_link') || '';

    saveBtn.addEventListener('click', () => {
        localStorage.setItem('portfolio_cv_link', input.value.trim());
        confirmMsg.style.display = 'block';
        setTimeout(() => { confirmMsg.style.display = 'none'; }, 2500);
    });
}

// ---------------------------------------------------------------
// EDIT / DELETE ROUTING (event delegation on the whole dashboard)
// ---------------------------------------------------------------
const OPEN_FORM_FNS = {
    projects: openProjectForm,
    tips: openTipForm,
    experience: openExperienceForm,
    skills: openSkillsForm,
    certifications: openCertificationForm
};

const GET_LIST_FNS = {
    projects: getProjectsAdmin,
    tips: getTips,
    experience: getExperience,
    skills: getSkillCategories,
    certifications: getCerts
};

const SAVE_LIST_FNS = {
    projects: saveProjectsAdmin,
    tips: (list) => localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(list)),
    experience: saveExperience,
    skills: saveSkillCategories,
    certifications: saveCerts
};

const RENDER_LIST_FNS = {
    projects: renderProjectsList,
    tips: renderTipsList,
    experience: renderExperienceList,
    skills: renderSkillsList,
    certifications: renderCertificationsList
};

function initActionDelegation() {
    document.body.addEventListener('click', (e) => {
        const addBtn = e.target.closest('[data-add]');
        if (addBtn) {
            OPEN_FORM_FNS[addBtn.getAttribute('data-add')]();
            return;
        }

        const editBtn = e.target.closest('[data-edit]');
        if (editBtn) {
            const type = editBtn.getAttribute('data-edit');
            const index = parseInt(editBtn.getAttribute('data-index'), 10);
            OPEN_FORM_FNS[type](index);
            return;
        }

        const deleteBtn = e.target.closest('[data-delete]');
        if (deleteBtn) {
            const type = deleteBtn.getAttribute('data-delete');
            const index = parseInt(deleteBtn.getAttribute('data-index'), 10);
            if (confirm('Delete this entry? This cannot be undone.')) {
                const list = GET_LIST_FNS[type]();
                list.splice(index, 1);
                SAVE_LIST_FNS[type](list);
                RENDER_LIST_FNS[type]();
            }
        }
    });
}

function renderAllTabs() {
    renderProjectsList();
    renderTipsList();
    renderExperienceList();
    renderSkillsList();
    renderCertificationsList();
    initCVTab();
}

// ---------------------------------------------------------------
// EXPORT / IMPORT
// ---------------------------------------------------------------
const ALL_DATA_KEYS = [
    'portfolio_projects',
    'portfolio_tips',
    'portfolio_experience',
    'portfolio_skills',
    'portfolio_certs',
    'portfolio_cv_link'
];

function initExportImport() {
    document.getElementById('admin-export-btn').addEventListener('click', () => {
        const data = {};
        ALL_DATA_KEYS.forEach(key => {
            if (key === 'portfolio_cv_link') {
                data[key] = localStorage.getItem(key) || '';
            } else {
                const raw = localStorage.getItem(key);
                data[key] = raw ? JSON.parse(raw) : [];
            }
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('admin-import-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                ALL_DATA_KEYS.forEach(key => {
                    if (data[key] !== undefined && data[key] !== null) {
                        const value = key === 'portfolio_cv_link' ? data[key] : JSON.stringify(data[key]);
                        localStorage.setItem(key, value);
                    }
                });
                renderAllTabs();
                alert('Data imported successfully.');
            } catch (err) {
                alert('That file is not valid JSON.');
            }
            e.target.value = '';
        };
        reader.readAsText(file);
    });
}

// ---------------------------------------------------------------
// INIT
// ---------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initLoginGate();
    initTabs();
    initModal();
    initActionDelegation();
    initExportImport();
});
