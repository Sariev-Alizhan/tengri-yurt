// ==========================================
// YURTA - INTERACTIVE FEATURES
// ==========================================

// Navigation scroll behavior
const navbar = document.getElementById('navbar');
const heroVideoBg = document.querySelector('.hero-video-bg');
const heroOverlay = document.querySelector('.hero-overlay');

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Navbar scroll behavior
    if (scrollPosition > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Video fade out effect - starts immediately on scroll
    if (heroVideoBg && heroOverlay) {
        const heroHeight = window.innerHeight;
        const fadeStart = 0; // Start fading immediately
        const fadeEnd = heroHeight * 0.6; // End fading at 60% of viewport height
        
        if (scrollPosition <= fadeStart) {
            heroVideoBg.style.opacity = '1';
            heroOverlay.style.opacity = '1';
        } else if (scrollPosition >= fadeEnd) {
            heroVideoBg.style.opacity = '0';
            heroOverlay.style.opacity = '0';
        } else {
            // Smooth easing function for natural fade
            const progress = scrollPosition / fadeEnd;
            const easeProgress = progress * progress; // Quadratic easing for smoother feel
            const opacity = 1 - easeProgress;
            
            heroVideoBg.style.opacity = opacity;
            heroOverlay.style.opacity = opacity;
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// HERO PARALLAX
// ==========================================

const heroContent = document.querySelector('.hero-content');
if (heroContent) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            const parallax = scrolled * 0.5;
            heroContent.style.transform = `translateY(${parallax}px)`;
            heroContent.style.opacity = 1 - (scrolled / 800);
        }
    });
}

// ==========================================
// FAQ ACCORDION
// ==========================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ==========================================
// FORM SUBMISSION
// ==========================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send the data to your backend
        console.log('Form submitted:', data);
        
        // Show success message (you can customize this)
        alert('Thank you for your inquiry! We will contact you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c🏕️ Yurta Website', 'font-size: 20px; color: #000; font-weight: bold;');
console.log('%cTraditional Yurts for the Modern World', 'font-size: 14px; color: #666;');
console.log('%cTengri Camp © 2024', 'font-size: 12px; color: #999;');
