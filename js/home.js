// ===================================================================
// HOME PAGE — Hero rotating-role typing effect
// Called by common.js via initPage() once the preloader finishes.
// ===================================================================

function initPage() {
    initTypingEffect();
}

function initTypingEffect() {
    const typedTextSpan = document.getElementById('typed-text');
    if (!typedTextSpan) return;

    const roles = ["Full-Stack Developer.", "WordPress Specialist.", "Web UI Engineer."];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newRoleDelay = 2000;
    let roleIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < roles[roleIndex].length) {
            typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newRoleDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, typingSpeed + 500);
        }
    }

    setTimeout(type, 1000);
}
