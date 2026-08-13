// ===================================================================
// TIP DETAIL PAGE — Populates the single template from ?id= in the URL
// Called by common.js via initPage() once the preloader finishes.
// ===================================================================

function getTipIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function formatTipDateLong(isoDate) {
    const d = new Date(isoDate);
    if (isNaN(d)) return isoDate;
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function renderMissingTip() {
    const main = document.getElementById('view-tip-detail');
    if (!main) return;
    main.innerHTML = `
        <div class="tip-not-found">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h2>Tip not found</h2>
            <p>This tip may have been removed or the link is incorrect.</p>
            <a href="tips.html" class="tip-cta-btn">Back to Tips</a>
        </div>`;
}

function renderTipDetail() {
    const id = getTipIdFromUrl();
    const tip = id ? getTipById(id) : null;

    if (!tip) {
        renderMissingTip();
        return;
    }

    document.title = `${tip.title} | Kiran Saif`;

    document.getElementById('tip-hero-category').textContent = tip.category;
    document.getElementById('tip-hero-title').textContent = tip.title;
    document.getElementById('tip-author').textContent = tip.author || 'Kiran Saif';
    document.getElementById('tip-date').textContent = formatTipDateLong(tip.date);
    document.getElementById('tip-readtime').textContent = tip.readTime || '';
    document.getElementById('tip-insight').textContent = tip.insight || tip.excerpt || '';
    document.getElementById('tip-why').textContent = tip.whyMatters || '';
    document.getElementById('tip-quote').textContent = tip.quote ? `"${tip.quote}"` : '';
    document.getElementById('tip-quote-author').textContent = tip.quoteAuthor || '';

    const codeSection = document.getElementById('tip-code-section');
    if (tip.codeBefore || tip.codeAfter) {
        document.getElementById('tip-code-before-label').textContent = tip.codeBeforeLabel || 'Before';
        document.getElementById('tip-code-after-label').textContent = tip.codeAfterLabel || 'After';
        document.getElementById('tip-code-before').textContent = tip.codeBefore || '';
        document.getElementById('tip-code-after').textContent = tip.codeAfter || '';
    } else {
        codeSection.style.display = 'none';
    }

    const principlesList = document.getElementById('tip-principles-list');
    principlesList.innerHTML = '';
    (tip.principles || []).forEach(point => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-check"></i> ${escapeHTML(point)}`;
        principlesList.appendChild(li);
    });
}

function initPage() {
    renderTipDetail();
}
