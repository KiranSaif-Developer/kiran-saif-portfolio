// ===================================================================
// CONTACT PAGE — Form validation
// Called by common.js via initPage() once the preloader finishes.
// ===================================================================

function initPage() {
    initContactValidation();
}

function initContactValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('.form-control');

    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateField(input);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        let isFormValid = true;

        inputs.forEach(input => {
            const isFieldValid = validateField(input);
            if (!isFieldValid) isFormValid = false;
        });

        if (!isFormValid) {
            e.preventDefault();
        }
    });

    function validateField(input) {
        const value = input.value.trim();
        const id = input.id;
        const errorMsg = document.getElementById(`${id.replace('-input', '')}-error`);
        let isValid = true;

        if (input.hasAttribute('required') && value === '') {
            isValid = false;
        } else if (input.type === 'email' && value !== '') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailPattern.test(value);
        }

        if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            if (errorMsg) errorMsg.style.display = 'none';
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
            if (errorMsg) errorMsg.style.display = 'block';
        }

        return isValid;
    }
}
