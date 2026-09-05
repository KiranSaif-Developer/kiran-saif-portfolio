// ===================================================================
// CERTIFICATIONS PAGE — Renders the original cert-card-pro design
// dynamically from data, then wires up filtering + lightbox.
// Called by common.js via initPage() once the preloader finishes.
//
// FIX: renderCertsGrid() now reads from the PUBLISHED_CERTIFICATIONS
// array (js/published-certifications.js) first — this is what every
// visitor sees, on every browser/device. Falls back to getCerts()
// (localStorage) only if that file/array isn't present, so local
// admin previewing still works.
// ===================================================================

function getPublishedOrLocalCerts() {
    if (typeof PUBLISHED_CERTIFICATIONS !== 'undefined' && PUBLISHED_CERTIFICATIONS.length > 0) {
        return PUBLISHED_CERTIFICATIONS;
    }
    return getCerts();
}

function renderCertsGrid() {
    const grid = document.getElementById('certs-grid');
    if (!grid) return;

    const certs = getPublishedOrLocalCerts();
    grid.innerHTML = '';

    certs.forEach((cert, idx) => {
        const lightboxKey = cert.id;
        const skillsText = (cert.keySkills || []).join(', ');
        const verifyHref = cert.verifyLink && cert.verifyLink !== '#' ? cert.verifyLink : '#';

        const cardHTML = `
            <div class="cert-card-pro" data-category="${escapeHTML(cert.category)}">
                <div class="cert-image-wrap" data-cert-target="${escapeHTML(lightboxKey)}" tabindex="0" role="button" aria-label="View full certificate">
                    <img src="${escapeHTML(cert.image || '')}" alt="${escapeHTML(cert.title)} preview" class="cert-image" loading="lazy">
                    <div class="cert-image-scrim"></div>
                    <div class="cert-zoom-hint"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
                </div>

                <div class="cert-body">
                    <h3 class="cert-name">${escapeHTML(cert.title)}</h3>
                    <span class="cert-issuer-name">${escapeHTML(cert.issuer)}</span>

                    <div class="cert-meta-pro">
                        <span class="cert-date-pro"><i class="fa-solid fa-calendar"></i> ${escapeHTML(cert.date)}</span>
                        <p class="cert-skills-pro">Key Skills: ${escapeHTML(skillsText)}</p>
                    </div>

                    <div class="cert-actions-pro">
                        <button class="btn-view-full" data-cert-target="${escapeHTML(lightboxKey)}"><i class="fa-solid fa-eye"></i> View Full</button>
                        <a href="${escapeHTML(verifyHref)}" target="_blank" rel="noopener noreferrer" class="cert-verify-link"><i class="fa-solid fa-link"></i> Verify Link</a>
                    </div>
                </div>
            </div>`;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });

    initCertFilters();
    initCertLightbox();
}

// ---------- Category Filter Tabs ----------
function initCertFilters() {
    const filterBtns = document.querySelectorAll('.cert-filter-btn');
    const cards = document.querySelectorAll('.cert-card-pro');
    const emptyMsg = document.getElementById('certs-empty-msg');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            let visibleCount = 0;

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                    visibleCount++;
                } else {
                    card.classList.add('hide');
                }
            });

            if (emptyMsg) {
                emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    });
}

// ---------- Click-to-Lightbox (image only) ----------
function initCertLightbox() {
    const lightbox = document.getElementById('cert-lightbox');
    const lightboxCard = document.getElementById('cert-lightbox-card');
    const closeBtn = document.getElementById('cert-lightbox-close');
    const triggers = document.querySelectorAll('[data-cert-target]');
    const certs = getPublishedOrLocalCerts();

    if (!lightbox || !lightboxCard) return;

    function openLightbox(certId) {
        const cert = certs.find(c => c.id === certId);
        if (!cert || !cert.image) return;

        lightboxCard.innerHTML = `<img src="${escapeHTML(cert.image)}" alt="Certificate" class="lb-image" onerror="this.replaceWith(Object.assign(document.createElement('div'), {className: 'lb-fallback', innerHTML: '<i class=\\'fa-solid fa-triangle-exclamation\\'></i><p>Image could not be loaded. Check your connection and try again.</p>'}))">`;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            openLightbox(trigger.getAttribute('data-cert-target'));
        });
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(trigger.getAttribute('data-cert-target'));
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function initPage() {
    renderCertsGrid();
}
