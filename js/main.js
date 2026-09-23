/* =============================================
   PORTFOLIO MAIN JS  |  Author: Vishal Raj
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------
       1. NAVBAR — scroll & mobile toggle
    ------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 30);
        }, { passive: true });
    }

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => mobileMenu.classList.add('visible'));
                });
            } else {
                mobileMenu.classList.remove('visible');
                setTimeout(() => mobileMenu.classList.add('hidden'), 350);
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('visible');
                setTimeout(() => mobileMenu.classList.add('hidden'), 350);
            });
        });
    }

    /* -------------------------------------------
       2. SCROLL REVEAL
    ------------------------------------------- */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
        revealObserver.observe(el);
    });

    /* -------------------------------------------
       3. SKILL BAR ANIMATION
    ------------------------------------------- */
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    if (skillBars.length > 0) {
        const barObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const w = entry.target.getAttribute('data-width');
                    if (w) setTimeout(() => { entry.target.style.width = w + '%'; }, 200);
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        skillBars.forEach(b => barObserver.observe(b));
    }

    /* -------------------------------------------
       4. CONTACT FORM
    ------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn  = document.getElementById('contact-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const name    = document.getElementById('contact-name')?.value.trim();
            const email   = document.getElementById('contact-email')?.value.trim();
            const message = document.getElementById('contact-message')?.value.trim();

            if (!name || !email || !message) {
                contactForm.querySelectorAll('.form-input, .form-textarea').forEach(inp => {
                    if (!inp.value.trim()) {
                        inp.style.borderColor = 'rgba(236,72,153,0.7)';
                        inp.style.boxShadow   = '0 0 0 3px rgba(236,72,153,0.15)';
                        inp.addEventListener('input', () => {
                            inp.style.borderColor = '';
                            inp.style.boxShadow   = '';
                        }, { once: true });
                    }
                });
                return;
            }

            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

            setTimeout(() => {
                if (formSuccess) formSuccess.style.display = 'block';
                contactForm.reset();
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
                setTimeout(() => { if (formSuccess) formSuccess.style.display = 'none'; }, 5000);
            }, 1200);
        });
    }

    /* -------------------------------------------
       5. PROJECT OVERLAY CLICK
    ------------------------------------------- */
    document.querySelectorAll('.project-card').forEach(card => {
        const viewLink = card.querySelector('[id$="-view-link"]');
        const overlay  = card.querySelector('.project-img-overlay');
        if (overlay && viewLink) {
            overlay.style.cursor = 'pointer';
            overlay.addEventListener('click', () => viewLink.click());
        }
    });

});