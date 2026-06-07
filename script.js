/**
 * Niharika Patel - Portfolio Website Scripts
 * Features: Light/Dark Theme, Mobile Menu, Canvas Constellation Background,
 *           Typing Animation, Scroll Reveal, Scroll Navigation Highlight, Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Theme Management
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('portfolio-theme', 'light');
        }
        // Reinitialize canvas particle colors on theme change
        initParticles();
    });

    // ==========================================================================
    // Mobile Menu Navigation
    // ==========================================================================
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // ==========================================================================
    // Typing Animation
    // ==========================================================================
    const typingTextElement = document.getElementById('typing-text');
    const roles = ["Computer Science Student", "Full Stack Developer", "Software Engineer", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Removing characters
            typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            // Writing characters
            typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // normal typing speed
        }

        // State control
        if (!isDeleting && charIndex === currentRole.length) {
            // Word complete, wait before starting to delete
            isDeleting = true;
            typingSpeed = 2000; // pause at the end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typingTextElement) {
        setTimeout(typeEffect, 1000);
    }

    // ==========================================================================
    // Canvas Particles (Constellation Effect)
    // ==========================================================================
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let numberOfParticles = 80;

    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Get particle colors based on current theme
    function getThemeColors() {
        const isLightTheme = body.classList.contains('light-theme');
        return {
            particle: isLightTheme ? 'rgba(100, 50, 255, 0.15)' : 'rgba(0, 229, 255, 0.18)',
            line: isLightTheme ? 'rgba(100, 50, 255, 0.04)' : 'rgba(0, 229, 255, 0.05)'
        };
    }

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * 0.6 - 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce back from edges
            if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
        }

        draw(color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles array
    function initParticles() {
        particlesArray = [];
        numberOfParticles = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    // Animation Loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const colors = getThemeColors();

        // Update and draw particles
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw(colors.particle);

            // Check distance between particles to draw lines
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Draw connection lines if close enough
                if (distance < 120) {
                    ctx.strokeStyle = colors.line;
                    ctx.lineWidth = 1 - (distance / 120);
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================================================
    // Intersection Observer for Scroll Reveal & Skill Bars
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing after it reveals
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Handle Skill progress bars reveal animation specifically
    const skillCards = document.querySelectorAll('.skill-category-card');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15
    });

    skillCards.forEach(card => {
        skillObserver.observe(card);
    });

    // ==========================================================================
    // Active Navigation Highlighting on Scroll
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 120; // Offset for navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Set active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // Contact Form Handler (Simulation)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit');
    const submitBtnSpan = submitBtn.querySelector('span');
    const submitBtnIcon = submitBtn.querySelector('i');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Set loading state
            submitBtn.disabled = true;
            submitBtnSpan.textContent = 'Sending...';
            submitBtnIcon.className = 'fa-solid fa-spinner fa-spin';

            // Simulate server response delay
            setTimeout(() => {
                // Get form details
                const name = document.getElementById('form-name').value;
                const email = document.getElementById('form-email').value;
                const subject = document.getElementById('form-subject').value;
                const message = document.getElementById('form-message').value;

                if (name && email && subject && message) {
                    // Show success feedback
                    formFeedback.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                    formFeedback.className = 'form-feedback-message success';
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    // Show error feedback
                    formFeedback.textContent = 'Oops! Please fill in all fields before sending.';
                    formFeedback.className = 'form-feedback-message error';
                }

                // Reset button state
                submitBtn.disabled = false;
                submitBtnSpan.textContent = 'Send Message';
                submitBtnIcon.className = 'fa-solid fa-paper-plane';

                // Automatically hide feedback message after 6 seconds
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 6000);
            }, 1500);
        });
    }
});
