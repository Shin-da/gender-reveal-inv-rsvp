// ===== COUNTDOWN FUNCTIONALITY =====

// Event date: September 13, 2025 at 11:00 AM
const EVENT_DATE = new Date('September 13, 2025 11:00:00').getTime();

// Countdown elements
let countdownInterval;
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');

// Initialize countdown when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Countdown script loaded');
    console.log('Event date:', new Date(EVENT_DATE));
    console.log('Days element:', daysElement);
    console.log('Hours element:', hoursElement);
    console.log('Minutes element:', minutesElement);
    console.log('Seconds element:', secondsElement);
    initCountdown();
    
    // Fallback initialization in case elements aren't ready
    setTimeout(() => {
        if (!countdownInterval) {
            console.log('Retrying countdown initialization...');
            initCountdown();
        }
    }, 1000);
});

function initCountdown() {
    // Check if all elements exist
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.error('Countdown elements not found!');
        console.log('Available elements:', {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        });
        return;
    }
    
    console.log('Countdown initialized successfully');
    
    // Start the countdown immediately
    updateCountdown();
    
    // Update countdown every second
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = EVENT_DATE - now;
    
    // If the event has passed
    if (distance < 0) {
        clearInterval(countdownInterval);
        showEventPassed();
        return;
    }
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update display with animation
    updateCountdownElement(daysElement, days);
    updateCountdownElement(hoursElement, hours);
    updateCountdownElement(minutesElement, minutes);
    updateCountdownElement(secondsElement, seconds);
    
    // Add special effects for last 24 hours
    if (days === 0 && hours <= 24) {
        addUrgencyEffect();
    }
    
    // Add special effects for last hour
    if (days === 0 && hours === 0 && minutes <= 60) {
        addFinalCountdownEffect();
    }
}

function updateCountdownElement(element, newValue) {
    const currentValue = parseInt(element.textContent);
    
    // Only animate if the value has changed
    if (currentValue !== newValue) {
        // Add changing animation class
        element.classList.add('changing');
        
        // Update the value
        element.textContent = newValue.toString().padStart(2, '0');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove('changing');
        }, 500);
    }
}

function showEventPassed() {
    const countdownContainer = document.querySelector('.countdown-container');
    if (countdownContainer) {
        countdownContainer.innerHTML = `
            <div class="event-passed">
                <h3 class="text-success">🎉 The Big Reveal Has Happened! 🎉</h3>
                <p>Thank you to everyone who joined us for this special celebration!</p>
                <div class="reveal-result">
                    <h4>It's a <span class="reveal-gender">BOY</span>! 👶</h4>
                    <p>Jay & Ynn are overjoyed to announce the arrival of their little prince!</p>
                </div>
            </div>
        `;
        
        // Add celebration animation
        addCelebrationEffect();
    }
}

function addUrgencyEffect() {
    const countdownContainer = document.querySelector('.countdown-container');
    if (countdownContainer && !countdownContainer.classList.contains('urgent')) {
        countdownContainer.classList.add('urgent');
        
        // Add pulsing effect to countdown numbers
        const countdownNumbers = document.querySelectorAll('.countdown-number');
        countdownNumbers.forEach(number => {
            number.classList.add('pulse');
        });
        
        // Update countdown title
        const countdownTitle = document.querySelector('.countdown-title');
        if (countdownTitle) {
            countdownTitle.textContent = "🚨 Less than 24 hours until the big reveal! 🚨";
            countdownTitle.style.color = '#dc3545';
            countdownTitle.style.fontWeight = 'bold';
        }
    }
}

function addFinalCountdownEffect() {
    const countdownContainer = document.querySelector('.countdown-container');
    if (countdownContainer && !countdownContainer.classList.contains('final-countdown')) {
        countdownContainer.classList.add('final-countdown');
        
        // Add bouncing effect to countdown numbers
        const countdownNumbers = document.querySelectorAll('.countdown-number');
        countdownNumbers.forEach(number => {
            number.classList.remove('pulse');
            number.classList.add('bounce-infinite');
        });
        
        // Update countdown title
        const countdownTitle = document.querySelector('.countdown-title');
        if (countdownTitle) {
            countdownTitle.textContent = "⚡ FINAL COUNTDOWN - The reveal is almost here! ⚡";
            countdownTitle.style.color = '#ffc107';
            countdownTitle.style.fontWeight = 'bold';
        }
        
        // Add confetti effect
        createConfetti();
    }
}

function addCelebrationEffect() {
    // Create multiple confetti bursts
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 500);
    }
    
    // Add celebration sound effect (if supported)
    playCelebrationSound();
}

function createConfetti() {
    const colors = ['#FF69B4', '#87CEEB', '#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C42', '#9370DB', '#20B2AA', '#FF1493', '#00CED1'];
    const shapes = ['circle', 'square', 'triangle', 'star'];
    const confettiCount = 80;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 8 + 6; // 6-14px
            const startX = Math.random() * 100; // Random starting position
            const animationDuration = Math.random() * 2 + 2; // 2-4 seconds
            const delay = Math.random() * 0.5; // Random delay for natural effect
            
            // Set base styles
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                position: fixed;
                top: -20px;
                left: ${startX}vw;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                z-index: 9999;
                animation: confetti-fall ${animationDuration}s linear ${delay}s forwards;
            `;
            
            // Apply different shapes and effects
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
                confetti.classList.add('spin');
            } else if (shape === 'square') {
                confetti.style.borderRadius = '2px';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            } else if (shape === 'triangle') {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.background = 'transparent';
                confetti.style.borderLeft = `${size/2}px solid transparent`;
                confetti.style.borderRight = `${size/2}px solid transparent`;
                confetti.style.borderBottom = `${size}px solid ${color}`;
                confetti.classList.add('bounce');
            } else if (shape === 'star') {
                // Create a simple star shape using CSS
                confetti.style.background = `radial-gradient(circle at 30% 30%, ${color} 0%, ${color} 40%, transparent 40%, transparent 100%),
                                           radial-gradient(circle at 70% 30%, ${color} 0%, ${color} 40%, transparent 40%, transparent 100%),
                                           radial-gradient(circle at 30% 70%, ${color} 0%, ${color} 40%, transparent 40%, transparent 100%),
                                           radial-gradient(circle at 70% 70%, ${color} 0%, ${color} 40%, transparent 40%, transparent 100%),
                                           radial-gradient(circle at 50% 50%, ${color} 0%, ${color} 60%, transparent 60%, transparent 100%)`;
                confetti.classList.add('spin');
            }
            
            // Add some pieces with different animation variations
            if (Math.random() > 0.7) {
                confetti.style.animationDelay = `${delay + 0.5}s`;
            }
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, (animationDuration + delay) * 1000 + 1000);
        }, i * 30); // Stagger creation for better visual effect
    }
}

function playCelebrationSound() {
    // Create a simple celebration sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a simple melody
        const frequencies = [523, 659, 784, 1047]; // C, E, G, C (higher)
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            }, index * 200);
        });
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
        // Silently fail if audio is not supported or blocked
        console.log('Audio not supported or blocked by browser');
    }
}

// Utility function to format time units
function formatTimeUnit(unit) {
    return unit.toString().padStart(2, '0');
}

// Get time until event in different formats
function getTimeUntilEvent() {
    const now = new Date().getTime();
    const distance = EVENT_DATE - now;
    
    if (distance < 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            total: 0,
            hasPassed: true
        };
    }
    
    return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        total: distance,
        hasPassed: false
    };
}

// Pause countdown (useful for performance when tab is not visible)
function pauseCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
}

// Resume countdown
function resumeCountdown() {
    if (!countdownInterval) {
        countdownInterval = setInterval(updateCountdown, 1000);
    }
}

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        pauseCountdown();
    } else {
        resumeCountdown();
    }
});

// Export functions for use in other scripts
window.CountdownManager = {
    getTimeUntilEvent,
    pauseCountdown,
    resumeCountdown,
    createConfetti,
    initCountdown
};

// Manual initialization function for debugging
window.initCountdownManual = function() {
    console.log('Manual countdown initialization');
    initCountdown();
};
