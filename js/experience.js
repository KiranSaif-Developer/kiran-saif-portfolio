// ===================================================================
// EXPERIENCE PAGE — Render Education / Experience columns from data
// Called by common.js via initPage() once the preloader finishes.
// ===================================================================

function renderExperienceColumn(containerId, columnKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = getExperience().filter(item => item.column === columnKey);
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = `<p class="exp-empty">Nothing added yet.</p>`;
        return;
    }

    items.forEach(item => {
        const bulletsHTML = (item.bullets || [])
            .map(b => `<p class="exp-desc">${escapeHTML(b)}</p>`)
            .join('');

        const companyHTML = item.company
            ? `<p class="exp-company">${escapeHTML(item.company)}</p>`
            : '';

        const cardHTML = `
            <div class="exp-item">
                <span class="exp-dot"></span>
                <div class="exp-card">
                    <span class="exp-date">${escapeHTML(item.duration)}</span>
                    <h4 class="exp-title">${escapeHTML(item.title)}</h4>
                    ${companyHTML}
                    ${bulletsHTML}
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function renderExperience() {
    renderExperienceColumn('education-timeline', 'education');
    renderExperienceColumn('experience-timeline', 'experience');
}

function initPage() {
    renderExperience();
}
