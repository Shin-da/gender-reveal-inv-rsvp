// ===== MAIN JAVASCRIPT FUNCTIONALITY =====

// Remove no-js class and add js-enabled class
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initSocialSharing();
    initFormEnhancements();
    initKeyboardNavigation(); // Accessibility
    manageFocus(); // Accessibility
    initDarkMode();
    initParallaxEffects();
    initParticleSystem();
    initEnhancedInteractions();
});

// ===== DARK MODE FUNCTIONALITY =====

function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(icon, currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(icon, newTheme);
        
        // Add transition effect
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        icon.style.color = '#FFD700';
    } else {
        icon.className = 'fas fa-moon';
        icon.style.color = '';
    }
}

// ===== PARALLAX EFFECTS =====

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
    
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.classList.contains('parallax-slow') ? 0.5 :
                         element.classList.contains('parallax-medium') ? 0.8 : 1.2;
            
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 16)); // 60fps
}

// ===== PARTICLE SYSTEM =====

function initParticleSystem() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    // Create additional particles dynamically
    for (let i = 0; i < 10; i++) {
        createParticle(heroSection);
    }
    
    // Create particles on mouse move
    let mouseX = 0, mouseY = 0;
    heroSection.addEventListener('mousemove', throttle(function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (Math.random() > 0.9) { // 10% chance to create particle
            createParticle(heroSection, mouseX, mouseY);
        }
    }, 100));
}

function createParticle(container, x = null, y = null) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const colors = ['var(--primary-pink)', 'var(--primary-blue)', 'var(--accent-gold)'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${randomColor};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        left: ${x || Math.random() * 100}%;
        top: ${y || Math.random() * 100}%;
        opacity: 0;
        animation: particle-float ${Math.random() * 4 + 6}s ease-out infinite;
        animation-delay: ${Math.random() * 2}s;
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 10000);
}

// ===== ENHANCED INTERACTIONS =====

function initEnhancedInteractions() {
    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn, .btn-primary, .btn-outline');
    buttons.forEach(button => {
        button.classList.add('button-click');
        
        // Add ripple effect
        button.addEventListener('click', function(e) {
            createRippleEffect(e, button);
        });
    });
    
    // Enhanced form interactions
    const formFields = document.querySelectorAll('.form-control, .form-select');
    formFields.forEach(field => {
        field.classList.add('form-field-focus');
        
        // Add floating label effect
        if (field.previousElementSibling && field.previousElementSibling.classList.contains('form-label')) {
            field.addEventListener('focus', function() {
                this.previousElementSibling.classList.add('label-active');
            });
            
            field.addEventListener('blur', function() {
                if (!this.value) {
                    this.previousElementSibling.classList.remove('label-active');
                }
            });
        }
    });
    
    // Enhanced card interactions
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('hover-lift');
        
        // Add tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== NAVIGATION FUNCTIONALITY =====

function initNavigation() {
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }, 16));
    
    // Active link highlighting
    window.addEventListener('scroll', throttle(function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 16));
    
    // Mobile menu close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
                entry.target.classList.add('animated');
                
                // Add staggered animation for child elements
                const staggerItems = entry.target.querySelectorAll('.stagger-item');
                staggerItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.remove('hidden');
                        item.classList.add('animated');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Add hidden class to elements that should animate
    document.querySelectorAll('.animate-on-scroll, .stagger-item').forEach(el => {
        el.classList.add('hidden');
        observer.observe(el);
    });
    
    // Add animation classes to sections
    addAnimationClasses();
    
    // Fallback: ensure content is visible after 3 seconds
    setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll.hidden, .stagger-item.hidden').forEach(el => {
            el.classList.remove('hidden');
            el.classList.add('animated');
        });
    }, 3000);
}

function addAnimationClasses() {
    // Add animation classes to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.classList.add('animate-on-scroll');
        item.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add animation classes to event cards
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add animation classes to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.classList.add('animate-on-scroll');
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// ===== SMOOTH SCROLLING =====

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SOCIAL SHARING =====

function initSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent('Jay & Ynn\'s Gender Reveal Party');
            const text = encodeURIComponent('Join us for a special gender reveal celebration!');
            
            let shareUrl = '';
            
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${text}%20${url}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${title}&body=${text}%20${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// ===== FORM ENHANCEMENTS =====

function initFormEnhancements() {
    const form = document.getElementById('rsvpForm');
    if (!form) return;
    
    // Real-time validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
    
    // Gender prediction button interactions
    const genderButtons = document.querySelectorAll('.btn-gender');
    genderButtons.forEach(button => {
        button.addEventListener('click', function() {
            genderButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            
            // Add celebration effect
            addCelebrationEffect(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Basic validation rules
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'guest_name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'phone':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;
        case 'attendee_count':
            if (value < 1 || value > 10) {
                isValid = false;
                errorMessage = 'Please enter a number between 1 and 10';
            }
            break;
    }
    
    // Apply validation classes
    if (isValid && value) {
        field.classList.add('is-valid');
        removeErrorMessage(field);
    } else if (!isValid) {
        field.classList.add('is-invalid');
        showErrorMessage(field, errorMessage);
    }
}

function showErrorMessage(field, message) {
    removeErrorMessage(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

function addCelebrationEffect(element) {
    // Create confetti effect
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createConfetti(element);
        }, i * 50);
    }
    
    // Add pulse animation
    element.classList.add('pulse-glow-continuous');
    setTimeout(() => {
        element.classList.remove('pulse-glow-continuous');
    }, 2000);
}

function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const confetti = document.createElement('div');
    
    const colors = ['#FF69B4', '#87CEEB', '#FFD700', '#FF6B6B', '#4ECDC4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${randomColor};
        left: ${rect.left + Math.random() * rect.width}px;
        top: ${rect.top}px;
        pointer-events: none;
        z-index: 1000;
        animation: confetti-fall 2s linear forwards;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 2000);
}

// ===== ACCESSIBILITY FEATURES =====

function initKeyboardNavigation() {
    // Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-pink);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id
    const mainContent = document.querySelector('main') || document.querySelector('.hero-section');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
}

function manageFocus() {
    // Trap focus in modal-like elements
    const modals = document.querySelectorAll('.modal, [role="dialog"]');
    
    modals.forEach(modal => {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    });
}

// ===== UTILITY FUNCTIONS =====

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== NOTIFICATION SYSTEM =====

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// ===== LOADING STATES =====

function setLoadingState(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
        
        const originalText = element.textContent;
        element.setAttribute('data-original-text', originalText);
        element.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
    } else {
        element.classList.remove('loading');
        element.disabled = false;
        
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
            element.textContent = originalText;
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        'images/hero-bg.jpg',
        'images/ultrasound.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();

// ===== SERVICE WORKER REGISTRATION (for PWA features) =====

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
