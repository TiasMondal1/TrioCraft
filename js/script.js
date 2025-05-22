// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const yearElement = document.getElementById('year');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

// Set current year in footer
yearElement.textContent = new Date().getFullYear();

// Check for saved theme preference or use preferred color scheme
const getCurrentTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme
const applyTheme = (theme) => {
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
};

// Initialize theme
applyTheme(getCurrentTheme());

// Theme toggle event
themeToggle.addEventListener('click', () => {
    const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
    applyTheme(newTheme);
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Animate hamburger bars
    const bars = hamburger.querySelectorAll('.bar');
    if (hamburger.classList.contains('active')) {
        bars[0].style.transform = 'translateY(8px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a nav link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        
        // Reset hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    });
});

// Portfolio filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        // Filter portfolio items
        portfolioItems.forEach(item => {
            const categories = item.getAttribute('data-category').split(' ');
            
            if (filterValue === 'all' || categories.includes(filterValue)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY;
    const headerHeight = document.querySelector('header').offsetHeight;
    
    // Get the home section (first section)
    const homeSection = document.querySelector('.hero');
    const homeLink = document.querySelector('a[href="#home"]');
    
    // Check if we're at the top of the page (home section)
    if (scrollPosition < homeSection.offsetHeight - headerHeight) {
        // Remove active class from all links
        navLinksItems.forEach(link => link.classList.remove('active'));
        // Add active class to home link
        homeLink.classList.add('active');
    } else {
        // Remove active class from home link
        homeLink.classList.remove('active');
        
        // Check other sections
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
});

// Form submission handling
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, you would send the form data to a server
        // For this demo, we'll just show a success message
        const formData = new FormData(this);
        const formValues = Object.fromEntries(formData.entries());
        
        console.log('Form submitted:', formValues);
        
        // Show success message
        this.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i><h3>Message Sent!</h3><p>Thank you for contacting us. We will get back to you soon.</p></div>';
    });
}

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, you would send the form data to a server
        // For this demo, we'll just show a success message
        const email = this.querySelector('input[type="email"]').value;
        
        console.log('Newsletter subscription:', email);
        
        // Show success message
        this.innerHTML = '<p class="success-text">Thank you for subscribing!</p>';
    });
}

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.service-card, .process-step, .tech-category, .testimonial-content, .contact-form');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('reveal', 'active');
        }
    });
};

// Add revealed class to elements in viewport on page load
window.addEventListener('load', revealOnScroll);

// Add revealed class to elements as they enter the viewport on scroll
window.addEventListener('scroll', revealOnScroll);

// Smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Testimonial Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    let currentSlide = 0;

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current slide and activate current dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Event listeners for prev/next buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
    }

    // Auto-advance slides every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
});

// Add CSS for reveal animations
const style = document.createElement('style');
style.textContent = `
    .service-card, .portfolio-item, .about-image, .about-text {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .success-message {
        text-align: center;
        padding: 2rem;
    }
    
    .success-message i {
        font-size: 4rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .success-text {
        color: var(--primary-color);
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// Floating elements parallax effect
const floatingElements = document.querySelectorAll('.float-element');
let mouseX = 0;
let mouseY = 0;

function handleMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}

function updateFloatingElements() {
    floatingElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed'));
        const x = mouseX * speed * 30;
        const y = mouseY * speed * 30;
        
        element.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    requestAnimationFrame(updateFloatingElements);
}

// Initialize floating elements
window.addEventListener('mousemove', handleMouseMove);
updateFloatingElements();

// Reset floating elements position when mouse leaves window
window.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
}); 