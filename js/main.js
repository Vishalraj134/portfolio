// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('visible');
        });
    }

    // Name animation
    const nameLetters = document.querySelectorAll('.name-letter');
    const nameContainer = document.querySelector('.name-container');

    if (nameContainer && nameLetters.length > 0) {
        // Add hover effect for letters
        nameLetters.forEach(letter => {
            letter.addEventListener('mouseover', createSparkles);
        });

        // Add magnetic effect
        nameContainer.addEventListener('mousemove', (e) => {
            const rect = nameContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const percentX = (e.clientX - centerX) / (rect.width / 2);
            const percentY = (e.clientY - centerY) / (rect.height / 2);
            
            nameLetters.forEach(letter => {
                const rotateX = -percentY * 15;
                const rotateY = percentX * 15;
                letter.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateZ(20px)
                `;
            });
        });

        nameContainer.addEventListener('mouseleave', () => {
            nameLetters.forEach(letter => {
                letter.style.transform = '';
            });
        });
    }
});

function createSparkles(e) {
    const letter = e.target;
    const rect = letter.getBoundingClientRect();
    
    for(let i = 0; i < 3; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'absolute w-1 h-1 bg-white rounded-full';
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            sparkle.style.transform = 'translate(-50%, -50%)';
            
            letter.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 700);
        }, i * 100);
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    
    if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Here you would typically send the data to a server
        console.log('Form submitted:', formData);
        
        // Clear form
        contactForm.reset();
        alert('Thank you for your message! I will get back to you soon.');
    });
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animation
function revealOnScroll() {
    const elements = document.querySelectorAll('.scroll-animate');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('animate-fadeInUp');
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); 