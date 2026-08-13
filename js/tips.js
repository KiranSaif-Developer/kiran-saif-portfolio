// ===================================================================
// TIPS PAGE — Render tip cards + dynamic category filter
// Called by common.js via initPage() once the preloader finishes.
// ===================================================================

function formatTipDate(isoDate) {
    const d = new Date(isoDate);
    if (isNaN(d)) return isoDate;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function categoryToSlug(category) {
    return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function renderTipsFilters(tips) {
    const tabsContainer = document.getElementById('tips-filter-tabs');
    if (!tabsContainer) return;

    const categories = [...new Set(tips.map(t => t.category))];

    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-filter', categoryToSlug(category));
        btn.textContent = category;
        tabsContainer.appendChild(btn);
    });

    const filterBtns = tabsContainer.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            document.querySelectorAll('.tip-card').forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}

function renderTips() {
    const container = document.getElementById('tips-container');
    if (!container) return;

    const tips = getTips();
    container.innerHTML = '';

    if (tips.length === 0) {
        container.innerHTML = `<p class="tips-empty">No tips added yet.</p>`;
        return;
    }

    tips.forEach((tip, idx) => {
        const delayClass = `delay-${(idx % 5) + 1}`;
        const indexNum = String(idx + 1).padStart(2, '0');

        const cardHTML = `
            <article class="tip-card animate-fade-up ${delayClass}" data-category="${categoryToSlug(tip.category)}">
                <span class="tip-index">${indexNum}</span>
                <div class="tip-card-body">
                    <div class="tip-meta-row">
                        <span class="tip-category">${escapeHTML(tip.category)}</span>
                        <span class="tip-date"><i class="fa-regular fa-calendar"></i> ${escapeHTML(formatTipDate(tip.date))}</span>
                    </div>
                    <h3 class="tip-title">${escapeHTML(tip.title)}</h3>
                    <p class="tip-excerpt">${escapeHTML(tip.excerpt)}</p>
                    <a href="tip-detail.html?id=${encodeURIComponent(tip.id)}" class="tip-readmore">
                        Read more <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </article>`;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });

    renderTipsFilters(tips);
}

function initPage() {
    renderTips();
}
