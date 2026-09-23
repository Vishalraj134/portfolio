/* =============================================
   ANIMATIONS.JS  |  Professional Animation Layer
   Author: Vishal Raj
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // Respect accessibility

    /* ─────────────────────────────────────────────
       0. CUSTOM CURSOR
    ───────────────────────────────────────────── */

    // Safety net: remove page-enter class after animation so body.transform
    // doesn't trap position:fixed children (they'd scroll with the page)
    setTimeout(() => document.body.classList.remove('page-enter'), 700);

    const DOT_SIZE  = 10;  // matches CSS width/height
    const RING_SIZE = 38;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.id  = 'cursor-dot';
    ring.id = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;

    // Position using left/top with hardcoded half-size offset
    const moveDot  = (x, y) => { dot.style.left  = (x - DOT_SIZE  / 2) + 'px'; dot.style.top  = (y - DOT_SIZE  / 2) + 'px'; };
    const moveRing = (x, y) => { ring.style.left = (x - RING_SIZE / 2) + 'px'; ring.style.top = (y - RING_SIZE / 2) + 'px'; };

    // Set initial position at center
    moveDot(mouseX, mouseY);
    moveRing(mouseX, mouseY);

    // Dot snaps instantly to mouse
    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        moveDot(mouseX, mouseY);
    }, { passive: true });

    // Ring lerps behind with smooth lag
    (function lerpRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        moveRing(ringX, ringY);
        requestAnimationFrame(lerpRing);
    })();

    // Hide cursors when mouse leaves the window
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

    // Click squeeze effect
    window.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    window.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    // Expand ring on interactive elements
    const bindHover = () => {
        const sel = 'a, button, [role="button"], input, textarea, select, label, .card, .project-card, .stat-card, .tech-chip, .social-btn, .nav-link, .btn-primary, .btn-outline, .soft-skill-item, .cert-card, .tag, .about-chip';
        document.querySelectorAll(sel).forEach(el => {
            if (el.dataset.ch) return;
            el.dataset.ch = '1';
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    };
    bindHover();
    setTimeout(bindHover, 1500); // re-bind after reveal animations





    /* ─────────────────────────────────────────────
       1. SCROLL PROGRESS BAR
    ───────────────────────────────────────────── */
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = pct + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
    }

    /* ─────────────────────────────────────────────
       2. CURSOR GLOW SPOTLIGHT
    ───────────────────────────────────────────── */
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);

    let glowX = window.innerWidth / 2, glowY = window.innerHeight / 2;
    let currentX = glowX, currentY = glowY;

    window.addEventListener('mousemove', e => {
        glowX = e.clientX;
        glowY = e.clientY;
    });

    (function animateGlow() {
        currentX += (glowX - currentX) * 0.06;
        currentY += (glowY - currentY) * 0.06;
        glow.style.left = currentX + 'px';
        glow.style.top  = currentY + 'px';
        requestAnimationFrame(animateGlow);
    })();

    /* ─────────────────────────────────────────────
       3. HERO PARTICLE CANVAS
    ───────────────────────────────────────────── */
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const colors = ['rgba(99,102,241,', 'rgba(168,85,247,', 'rgba(236,72,153,'];

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x  = Math.random() * canvas.width;
                this.y  = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.r  = Math.random() * 1.8 + 0.4;
                this.a  = Math.random() * 0.5 + 0.1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.a + ')';
                ctx.fill();
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
        }

        const COUNT = Math.min(90, Math.floor(canvas.width * canvas.height / 8000));
        for (let i = 0; i < COUNT; i++) particles.push(new Particle());

        // Draw connecting lines between nearby particles
        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLines();
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(loop);
        };
        loop();
    }

    /* ─────────────────────────────────────────────
       4. TYPEWRITER ROLE CYCLER
    ───────────────────────────────────────────── */
    const roles = [
        'Full-Stack Developer',
        'AI / ML Engineer',
        'React.js Developer',
        'Python Enthusiast',
        'Problem Solver'
    ];

    // Insert typewriter element after the hero description first line if present
    const heroDesc = document.querySelector('.hero-desc');
    if (heroDesc) {
        const tw = document.createElement('div');
        tw.id = 'hero-role-typewriter';
        tw.setAttribute('aria-live', 'polite');
        heroDesc.parentNode.insertBefore(tw, heroDesc);

        let roleIdx = 0, charIdx = 0, deleting = false;

        const type = () => {
            const current = roles[roleIdx];
            if (!deleting) {
                tw.textContent = current.slice(0, ++charIdx);
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(type, 1800);
                    return;
                }
                setTimeout(type, 60);
            } else {
                tw.textContent = current.slice(0, --charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    roleIdx = (roleIdx + 1) % roles.length;
                    setTimeout(type, 300);
                    return;
                }
                setTimeout(type, 35);
            }
        };
        setTimeout(type, 600);
    }

    /* ─────────────────────────────────────────────
       5. ANIMATED STAT COUNTERS
    ───────────────────────────────────────────── */
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
        // Detect numeric value from text
        const text = el.textContent.trim();
        const num = parseFloat(text);
        if (isNaN(num)) return;
        const suffix = text.replace(/[\d.]/g, '');
        el.setAttribute('data-target', num);
        el.setAttribute('data-suffix', suffix);
        el.textContent = '0' + suffix;
    });

    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            if (isNaN(target)) return;

            const duration = 1600;
            const start = performance.now();
            const isFloat = target % 1 !== 0;

            const tick = now => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = eased * target;
                el.textContent = (isFloat ? value.toFixed(2) : Math.floor(value)) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => {
        if (el.hasAttribute('data-target')) counterObserver.observe(el);
    });

    /* ─────────────────────────────────────────────
       6. 3D TILT CARDS
    ───────────────────────────────────────────── */
    const tiltTargets = document.querySelectorAll('.card, .project-card, .stat-card');

    tiltTargets.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width  / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            const tiltX = dy * -6;   // max 6deg
            const tiltY = dx * 6;
            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px) scale(1.02)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
        });
    });

    /* ─────────────────────────────────────────────
       7. MAGNETIC BUTTONS
    ───────────────────────────────────────────── */
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline, .social-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) * 0.25;
            const dy = (e.clientY - cy) * 0.25;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
            btn.style.transition = 'transform 0.15s ease';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
        });
    });

    /* ─────────────────────────────────────────────
       8. FLOATING ORBS AROUND PROFILE IMAGE
    ───────────────────────────────────────────── */
    const profileContainer = document.querySelector('.profile-img-container');
    if (profileContainer) {
        const orbs = [
            { size: 10, top: '-8px',  left: '20%',  dur: '4s',  delay: '0s',   tx: '8px',   ty: '-12px' },
            { size: 7,  top: '15%',   left: '-12px', dur: '5s',  delay: '0.8s', tx: '-10px', ty: '8px'  },
            { size: 12, top: '70%',   left: '-8px',  dur: '6s',  delay: '0.3s', tx: '-8px',  ty: '-10px' },
            { size: 8,  top: '80%',   left: '75%',   dur: '3.5s',delay: '1.2s', tx: '10px',  ty: '8px'  },
            { size: 6,  top: '10%',   left: '80%',   dur: '4.5s',delay: '0.5s', tx: '6px',   ty: '-8px' },
        ];
        orbs.forEach(o => {
            const orb = document.createElement('div');
            orb.className = 'profile-orb';
            orb.style.cssText = `
                width:${o.size}px; height:${o.size}px;
                top:${o.top}; left:${o.left};
                --dur:${o.dur}; --delay:${o.delay};
                --tx:${o.tx}; --ty:${o.ty};
            `;
            profileContainer.appendChild(orb);
        });
    }

    /* ─────────────────────────────────────────────
       9. ENHANCED SCROLL REVEAL (blur + scale)
    ───────────────────────────────────────────── */
    const revealScaleObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealScaleObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    document.querySelectorAll('.reveal-scale, .stagger-pro, .section-title-animated').forEach(el => {
        revealScaleObserver.observe(el);
    });

    /* ─────────────────────────────────────────────
       10. SHIMMER on all cards
    ───────────────────────────────────────────── */
    document.querySelectorAll('.card, .project-card, .stat-card, .tech-chip').forEach(card => {
        card.classList.add('card-shimmer');
    });

    /* ─────────────────────────────────────────────
       11. GLITCH on hero name
    ───────────────────────────────────────────── */
    // Apply glitch to the "Hi, I'm " text part only
    const heroGreeting = document.querySelector('.hero-greeting');
    if (heroGreeting) {
        // Find the text node "Hi, I'm Vishal Raj"
        const firstNode = heroGreeting.firstChild;
        if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
            const text = firstNode.textContent.trim();
            if (text) {
                const span = document.createElement('span');
                span.className = 'glitch';
                span.setAttribute('data-text', text);
                span.textContent = text;
                firstNode.replaceWith(span);
            }
        }
    }

    /* ─────────────────────────────────────────────
       12. SMOOTH SECTION LABEL UNDERLINE DRAW
    ───────────────────────────────────────────── */
    document.querySelectorAll('.section-title').forEach(el => {
        el.classList.add('section-title-animated');
        revealScaleObserver.observe(el);
    });

    /* ─────────────────────────────────────────────
       13. NAV LINK HOVER RIPPLE
    ───────────────────────────────────────────── */
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            const ripple = document.createElement('span');
            const rect = link.getBoundingClientRect();
            ripple.style.cssText = `
                position:absolute; border-radius:50%;
                width:80px; height:80px;
                background:rgba(99,102,241,0.2);
                transform:scale(0);
                animation:rippleOut 0.5s linear;
                pointer-events:none;
                top:${e.clientY - rect.top - 40}px;
                left:${e.clientX - rect.left - 40}px;
            `;
            link.style.position = 'relative';
            link.style.overflow = 'hidden';
            link.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);
        });
    });

    // Inject ripple keyframe
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `@keyframes rippleOut { to { transform:scale(2.5); opacity:0; } }`;
    document.head.appendChild(rippleStyle);

    /* ─────────────────────────────────────────────
       14. SCROLL-TRIGGERED SECTION ENTRANCE
         (Adds stagger-pro class to grids dynamically)
    ───────────────────────────────────────────── */
    document.querySelectorAll('.stats-row, .about-grid').forEach(grid => {
        grid.classList.add('stagger-pro');
        revealScaleObserver.observe(grid);
    });

    /* ─────────────────────────────────────────────
       15. SMOOTH MOUSE-PARALLAX on hero blobs
    ───────────────────────────────────────────── */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        let targetParallaxX = 0, targetParallaxY = 0;
        let curParallaxX = 0, curParallaxY = 0;

        window.addEventListener('mousemove', e => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            targetParallaxX = (e.clientX - cx) / cx * 18;
            targetParallaxY = (e.clientY - cy) / cy * 10;
        });

        (function parallaxLoop() {
            curParallaxX += (targetParallaxX - curParallaxX) * 0.04;
            curParallaxY += (targetParallaxY - curParallaxY) * 0.04;
            heroBg.style.transform = `translate(${curParallaxX}px, ${curParallaxY}px)`;
            requestAnimationFrame(parallaxLoop);
        })();
    }

});
