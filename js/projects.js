// ===================================================================
// PROJECTS PAGE — Render showcase cards + category filter
// Called by common.js via initPage() once the preloader finishes.
//
// FIX: renderProjects() now loads the PUBLISHED list from
// data/projects.json (a real file, visible to every visitor),
// instead of reading localStorage (which only exists in the browser
// where the admin panel was used). Falls back to localStorage only
// if the JSON file is missing/empty, so local admin previewing still works.
// ===================================================================

function initPage() {
    renderProjects();
    initProjectFilters();
}

function getProjectPreviewUrl(project) {
    if (project.image) {
        let imageUrl = project.image.trim();

        // Local project image path
        if (
            !imageUrl.startsWith('http://') &&
            !imageUrl.startsWith('https://') &&
            !imageUrl.startsWith('/')
        ) {
            imageUrl = '/' + imageUrl;
        }

        return imageUrl;
    }

    const liveUrl = project.url && project.url !== '#' ? project.url : null;
    if (liveUrl) {
        return `https://s0.wp.com/mshots/v1/${encodeURIComponent(liveUrl)}?w=900&h=560`;
    }

    const repoUrl = project.sourceCode && project.sourceCode !== '#' ? project.sourceCode : null;
    if (repoUrl && repoUrl.includes('github.com')) {
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/?#]+)/);
        if (match) {
            const repo = match[2].replace(/\.git$/, '');
            return `https://opengraph.githubassets.com/1/${match[1]}/${repo}`;
        }
    }

    return null;
}

function getAlternatePreviewUrl(project) {
    const liveUrl = project.url && project.url !== '#' ? project.url : null;
    if (!liveUrl) return null;
    return `https://image.thum.io/get/width/900/crop/560/noanimate/${liveUrl}`;
}

function getDisplayUrl(project) {
    if (project.url && project.url !== '#') return project.url;
    if (project.sourceCode && project.sourceCode !== '#') return project.sourceCode;
    return 'No live URL';
}

function truncateUrl(url, max = 42) {
    if (!url || url === 'No live URL') return url;
    try {
        const parsed = new URL(url);
        const display = parsed.hostname + parsed.pathname;
        return display.length > max ? display.slice(0, max) + '…' : display;
    } catch {
        return url.length > max ? url.slice(0, max) + '…' : url;
    }
}

function buildPreviewHTML(project, category) {
    const previewUrl = getProjectPreviewUrl(project);
    const displayUrl = truncateUrl(getDisplayUrl(project));
    const fallbackIcon = category === 'wordpress'
        ? 'fa-brands fa-wordpress'
        : 'fa-solid fa-code';

    if (!previewUrl) {
        return `
            <div class="proj-preview">
                <div class="proj-browser-bar">
                    <span class="proj-browser-dot red"></span>
                    <span class="proj-browser-dot yellow"></span>
                    <span class="proj-browser-dot green"></span>
                    <span class="proj-browser-url">${escapeHTML(displayUrl)}</span>
                </div>
                <div class="proj-screenshot-wrap loaded">
                    <div class="proj-screenshot-fallback">
                        <i class="${fallbackIcon}"></i>
                        <span>Preview unavailable</span>
                    </div>
                </div>
            </div>`;
    }

    return `
        <div class="proj-preview">
            <div class="proj-browser-bar">
                <span class="proj-browser-dot red"></span>
                <span class="proj-browser-dot yellow"></span>
                <span class="proj-browser-dot green"></span>
                <span class="proj-browser-url">${escapeHTML(displayUrl)}</span>
            </div>
            <div class="proj-screenshot-wrap" data-project-id="${escapeHTML(project.id)}">
                <div class="proj-screenshot-shimmer"></div>
                <img
                    class="proj-screenshot"
                    src="${escapeHTML(previewUrl)}"
                    alt="${escapeHTML(project.title)} preview"
                    loading="lazy"
                    decoding="async"
                    data-alt-src="${escapeHTML(getAlternatePreviewUrl(project) || '')}"
                />
                <div class="proj-screenshot-fallback" style="display:none;">
                    <i class="${fallbackIcon}"></i>
                    <span>Preview unavailable</span>
                </div>
            </div>
        </div>`;
}

function initScreenshotHandlers() {
    document.querySelectorAll('.proj-screenshot').forEach(img => {
        const wrap = img.closest('.proj-screenshot-wrap');
        const fallback = wrap?.querySelector('.proj-screenshot-fallback');

        const showFallback = () => {
            img.style.display = 'none';
            if (fallback) fallback.style.display = 'flex';
            wrap?.classList.add('loaded');
        };

        img.addEventListener('load', () => {
            wrap?.classList.add('loaded');
        });

        img.addEventListener('error', () => {
            const altSrc = img.getAttribute('data-alt-src');
            if (altSrc && !img.dataset.retried) {
                img.dataset.retried = 'true';
                img.src = altSrc;
                return;
            }
            showFallback();
        });

        if (img.complete && img.naturalWidth > 0) {
            wrap?.classList.add('loaded');
        }
    });
}

function renderProjectCards(projects) {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';

    if (!projects || projects.length === 0) {
        projectsContainer.innerHTML = `<p class="projects-empty">No projects added yet.</p>`;
        return;
    }

    projects.forEach((project, idx) => {
        const tagsHTML = project.tech
            ? project.tech.split(',').map(t => `<span class="project-tag">${escapeHTML(t.trim())}</span>`).join('')
            : '';

        let actionsHTML = '';
        if (project.url && project.url !== '#') {
            actionsHTML += `<a href="${escapeHTML(project.url)}" target="_blank" rel="noopener noreferrer" class="proj-btn proj-btn-primary"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>`;
        }
        if (project.sourceCode && project.sourceCode !== '#') {
            actionsHTML += `<a href="${escapeHTML(project.sourceCode)}" target="_blank" rel="noopener noreferrer" class="proj-btn"><i class="fa-brands fa-github"></i> Source Code</a>`;
        }

        const isWordPress = (project.tech || '').toLowerCase().includes('wordpress') || (project.tech || '').toLowerCase().includes('woocommerce');
        const category = isWordPress ? 'wordpress' : 'web-apps';
        const categoryLabel = isWordPress ? 'WordPress' : 'Web App';
        const delayClass = `delay-${(idx % 5) + 1}`;
        const indexNum = String(idx + 1).padStart(2, '0');

        const cardHTML = `
            <article class="project-card animate-fade-up ${delayClass}" data-category="${category}">
                ${buildPreviewHTML(project, category)}
                <div class="proj-body">
                    <div class="proj-header-row">
                        <span class="proj-index">${indexNum}</span>
                        <span class="proj-category ${category === 'wordpress' ? 'wordpress' : ''}">${categoryLabel}</span>
                    </div>
                    <h3 class="project-title">${escapeHTML(project.title)}</h3>
                    <p class="project-desc">${escapeHTML(project.description)}</p>
                    <div class="project-tags">${tagsHTML}</div>
                    <div class="proj-actions">${actionsHTML}</div>
                </div>
            </article>
        `;
        projectsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    initScreenshotHandlers();
}

function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    // 1) Use the PUBLISHED list first — this is what every visitor sees,
    //    regardless of their browser or device. Comes from js/published-projects.js.
    if (typeof PUBLISHED_PROJECTS !== 'undefined' && PUBLISHED_PROJECTS.length > 0) {
        renderProjectCards(PUBLISHED_PROJECTS);
        return;
    }

    // 2) Fallback: localStorage (useful while you're still building/testing
    //    locally in the admin panel, before you've published anything yet).
    const localProjects = JSON.parse(localStorage.getItem('portfolio_projects')) || [];
    renderProjectCards(localProjects);
}

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn:not([data-tab])');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            const projectCards = document.querySelectorAll('.project-card');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}
