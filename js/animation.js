// Enhanced 3D animations
function init3DEffects() {
    const elements = document.querySelectorAll('.parallax-element');
    const cards = document.querySelectorAll('.card-3d');
    const floatingElements = document.querySelectorAll('.floating-3d');
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Smooth parallax effect
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        targetX = (mouseX - windowWidth / 2) * 0.1;
        targetY = (mouseY - windowHeight / 2) * 0.1;

        elements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.05;
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distanceX = (mouseX - centerX) * speed;
            const distanceY = (mouseY - centerY) * speed;
            
            element.style.transform = `
                perspective(1000px)
                rotateX(${-distanceY * 0.05}deg)
                rotateY(${distanceX * 0.05}deg)
                translateZ(20px)
                scale(1.05)
            `;
        });
    });

    // Enhanced card hover effect
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * 15;
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${-rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(50px)
                scale(1.05)
            `;
            
            // Dynamic shine effect
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.background = `
                    radial-gradient(
                        circle at ${x}px ${y}px,
                        rgba(255,255,255,0.3) 0%,
                        rgba(255,255,255,0) 80%
                    )
                `;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.background = 'none';
            }
        });
    });

    // Floating animation with 3D effect
    floatingElements.forEach((element, index) => {
        element.style.animation = `float-3d ${3 + index * 0.5}s ease-in-out infinite`;
        element.style.animationDelay = `${index * 0.2}s`;
    });
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    init3DEffects();
}); 