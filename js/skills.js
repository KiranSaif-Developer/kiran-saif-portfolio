// ===================================================================
// SKILLS PAGE — Render category grid from data
// Called by common.js via initPage() once the preloader finishes.
// ===================================================================

function renderSkills() {
    const container = document.getElementById('skills-grid');
    if (!container) return;

    const categories = getSkillCategories();
    container.innerHTML = '';

    if (categories.length === 0) {
        container.innerHTML = `<p class="skills-empty">No skills added yet.</p>`;
        return;
    }

    categories.forEach(cat => {
        const badgesHTML = (cat.skills || [])
            .map(s => `<span class="skill-badge"><i class="${escapeHTML(s.icon || 'fa-solid fa-star')}"></i> ${escapeHTML(s.name)}</span>`)
            .join('');

        const categoryHTML = `
            <div class="skill-category">
                <h3 class="category-title"><i class="${escapeHTML(cat.categoryIcon || 'fa-solid fa-star')}"></i> ${escapeHTML(cat.categoryName)}</h3>
                <div class="badge-wrapper">${badgesHTML}</div>
            </div>`;
        container.insertAdjacentHTML('beforeend', categoryHTML);
    });
}

function initPage() {
    renderSkills();
}
