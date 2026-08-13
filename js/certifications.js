// ===================================================================
// CERTIFICATIONS PAGE
// Dynamically renders certification cards + lightbox.
// ===================================================================

function renderCertsGrid() {
    const grid = document.getElementById('certs-grid');
    if (!grid) return;

    const certs = getCerts();
    grid.innerHTML = '';

    certs.forEach((cert, idx) => {
        const lightboxKey = cert.id;
        const skillsText = (cert.keySkills || []).join(', ');
        const verifyHref =
            cert.verifyLink && cert.verifyLink !== '#'
                ? cert.verifyLink
                : '#';

        const cardHTML = `
            <div class="cert-card-pro">
                <div
                    class="cert-image-wrap"
                    data-cert-target="${escapeHTML(lightboxKey)}"
                    tabindex="0"
                    role="button"
                    aria-label="View full certificate"
                >
                    <img
                        src="${escapeHTML(cert.image || '')}"
                        alt="${escapeHTML(cert.title)} preview"
                        class="cert-image"
                        loading="lazy"
                    >

                    <div class="cert-image-scrim"></div>

                    <div class="cert-zoom-hint">
                        <i class="fa-solid fa-magnifying-glass-plus"></i>
                    </div>
                </div>

                <div class="cert-body">
                    <h3 class="cert-name">
                        ${escapeHTML(cert.title)}
                    </h3>

                    <span class="cert-issuer-name">
                        ${escapeHTML(cert.issuer)}
                    </span>

                    <div class="cert-meta-pro">
                        <span class="cert-date-pro">
                            <i class="fa-solid fa-calendar"></i>
                            ${escapeHTML(cert.date)}
                        </span>

                        <p class="cert-skills-pro">
                            Key Skills: ${escapeHTML(skillsText)}
                        </p>
                    </div>

                    <div class="cert-actions-pro">
                        <button
                            class="btn-view-full"
                            data-cert-target="${escapeHTML(lightboxKey)}"
                        >
                            <i class="fa-solid fa-eye"></i>
                            View Full
                        </button>

                        <a
                            href="${escapeHTML(verifyHref)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="cert-verify-link"
                        >
                            <i class="fa-solid fa-link"></i>
                            Verify Link
                        </a>
                    </div>
                </div>
            </div>
        `;

        grid.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Filter removed
    // Lightbox remains
    initCertLightbox();
}


// ---------- Click-to-Lightbox ----------

function initCertLightbox() {
    const lightbox = document.getElementById('cert-lightbox');
    const lightboxCard = document.getElementById('cert-lightbox-card');
    const closeBtn = document.getElementById('cert-lightbox-close');
    const triggers = document.querySelectorAll('[data-cert-target]');
    const certs = getCerts();

    if (!lightbox || !lightboxCard) return;

    function openLightbox(certId) {
        const cert = certs.find(c => c.id === certId);

        if (!cert || !cert.image) return;

        lightboxCard.innerHTML = `
            <img
                src="${escapeHTML(cert.image)}"
                alt="Certificate"
                class="lb-image"
                onerror="this.replaceWith(
                    Object.assign(
                        document.createElement('div'),
                        {
                            className: 'lb-fallback',
                            innerHTML: '<i class=\\'fa-solid fa-triangle-exclamation\\'></i><p>Image could not be loaded. Check your connection and try again.</p>'
                        }
                    )
                )"
            >
        `;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            openLightbox(
                trigger.getAttribute('data-cert-target')
            );
        });

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();

                openLightbox(
                    trigger.getAttribute('data-cert-target')
                );
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'Escape' &&
            lightbox.classList.contains('active')
        ) {
            closeLightbox();
        }
    });
}


function initPage() {
    renderCertsGrid();
}