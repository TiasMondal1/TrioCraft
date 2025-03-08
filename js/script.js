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
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
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

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.service-card, .portfolio-item, .about-image, .about-text');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('revealed');
        }
    });
};

// Add revealed class to elements in viewport on page load
window.addEventListener('load', revealOnScroll);

// Add revealed class to elements as they enter the viewport on scroll
window.addEventListener('scroll', revealOnScroll);

// Testimonial Slider
const testimonialSlider = document.querySelector('.testimonial-slider');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideInterval;

// Initialize testimonial slider
const initTestimonialSlider = () => {
    // Set initial position
    updateSliderPosition();
    
    // Start auto-sliding
    startSlideInterval();
    
    // Add event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSliderPosition();
            resetSlideInterval();
        });
    });
    
    // Pause auto-sliding when hovering over slider
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // Resume auto-sliding when mouse leaves slider
    testimonialSlider.addEventListener('mouseleave', () => {
        startSlideInterval();
    });
    
    // Add touch support for mobile
    let startX, endX;
    testimonialSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    testimonialSlider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        
        if (startX - endX > 50) { // Swipe left
            nextSlide();
        } else if (endX - startX > 50) { // Swipe right
            prevSlide();
        }
    });
};

// Update slider position
const updateSliderPosition = () => {
    // Update slider transform
    testimonialSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
};

// Go to next slide
const nextSlide = () => {
    currentSlide = (currentSlide + 1) % testimonialSlides.length;
    updateSliderPosition();
};

// Go to previous slide
const prevSlide = () => {
    currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
    updateSliderPosition();
};

// Start auto-sliding
const startSlideInterval = () => {
    slideInterval = setInterval(nextSlide, 5000);
};

// Reset slide interval
const resetSlideInterval = () => {
    clearInterval(slideInterval);
    startSlideInterval();
};

// Initialize testimonial slider if it exists
if (testimonialSlider && testimonialSlides.length > 0) {
    initTestimonialSlider();
}

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