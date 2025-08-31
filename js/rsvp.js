// ===== RSVP FUNCTIONALITY =====

// Supabase configuration
// Note: These should be set as environment variables in production
const SUPABASE_URL = 'https://nmruhcjzmdcyohpgavcb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcnVoY2p6bWRjeW9ocGdhdmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzkwNTUsImV4cCI6MjA3MjE1NTA1NX0.V8SzHe8X9sHDXUvwO36DZWYP3gupF0x4YlYwnOJ2sXk';

// Initialize Supabase client
let supabase;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
    console.error('Supabase client initialization failed:', error);
}

// Form elements
let rsvpForm;
let formMessages;
let submitButton;

// Initialize RSVP functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initRSVP();
});

function initRSVP() {
    rsvpForm = document.getElementById('rsvpForm');
    formMessages = document.getElementById('formMessages');
    submitButton = document.querySelector('.submit-btn');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', handleFormSubmit);
        initFormValidation();
        initGenderPredictionButtons();
        initAttendanceLogic();
    }
}

// ===== FORM SUBMISSION =====

async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return false;
    }
    
    // Set loading state
    setLoadingState(submitButton, true);
    
    try {
        // Get form data
        const formData = getFormData();
        
        // Submit to Supabase
        const result = await submitRSVP(formData);
        
        if (result.success) {
            showSuccessMessage();
            resetForm();
            trackRSVPSubmission(formData);
        } else {
            showErrorMessage(result.error || 'Failed to submit RSVP. Please try again.');
        }
    } catch (error) {
        console.error('RSVP submission error:', error);
        showErrorMessage('An unexpected error occurred. Please try again later.');
    } finally {
        setLoadingState(submitButton, false);
    }
}

function getFormData() {
    const formData = new FormData(rsvpForm);
    
    return {
        guest_name: formData.get('guestName'),
        email: formData.get('email'),
        phone: formData.get('phone') || null,
        attendee_count: parseInt(formData.get('attendeeCount')),
        attendance: formData.get('attendance'),
        dietary_restrictions: formData.get('dietaryRestrictions') || null,
        gender_prediction: formData.get('genderPrediction'),
        special_message: formData.get('specialMessage') || null,
        created_at: new Date().toISOString()
    };
}

async function submitRSVP(data) {
    // If Supabase is not configured, use fallback
    if (!supabase) {
        return await submitRSVPFallback(data);
    }
    
    try {
        const { data: result, error } = await supabase
            .from('rsvp_responses')
            .insert([data])
            .select();
        
        if (error) {
            console.error('Supabase error:', error);
            return { success: false, error: error.message };
        }
        
        // Update predictions summary
        await updatePredictionsSummary(data.gender_prediction);
        
        return { success: true, data: result };
    } catch (error) {
        console.error('RSVP submission error:', error);
        return { success: false, error: error.message };
    }
}

async function submitRSVPFallback(data) {
    // Fallback: Store in localStorage for demo purposes
    try {
        const existingRSVPs = JSON.parse(localStorage.getItem('rsvp_responses') || '[]');
        const newRSVP = {
            id: Date.now(),
            ...data
        };
        
        existingRSVPs.push(newRSVP);
        localStorage.setItem('rsvp_responses', JSON.stringify(existingRSVPs));
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { success: true, data: newRSVP };
    } catch (error) {
        return { success: false, error: 'Failed to save RSVP locally' };
    }
}

async function updatePredictionsSummary(prediction) {
    if (!supabase) return;
    
    try {
        // Get current summary
        const { data: currentSummary } = await supabase
            .from('predictions_summary')
            .select('*')
            .single();
        
        if (currentSummary) {
            // Update existing summary
            const updates = {
                boy_count: currentSummary.boy_count + (prediction === 'boy' ? 1 : 0),
                girl_count: currentSummary.girl_count + (prediction === 'girl' ? 1 : 0),
                updated_at: new Date().toISOString()
            };
            
            await supabase
                .from('predictions_summary')
                .update(updates)
                .eq('id', currentSummary.id);
        } else {
            // Create new summary
            await supabase
                .from('predictions_summary')
                .insert([{
                    boy_count: prediction === 'boy' ? 1 : 0,
                    girl_count: prediction === 'girl' ? 1 : 0,
                    updated_at: new Date().toISOString()
                }]);
        }
    } catch (error) {
        console.error('Error updating predictions summary:', error);
    }
}

// ===== FORM VALIDATION =====

function initFormValidation() {
    const requiredFields = rsvpForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
}

function validateForm() {
    const requiredFields = rsvpForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = rsvpForm.querySelector('#email');
    if (emailField && emailField.value) {
        if (!isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Validate phone format (if provided)
    const phoneField = rsvpForm.querySelector('#phone');
    if (phoneField && phoneField.value) {
        if (!isValidPhone(phoneField.value)) {
            showFieldError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    if (isRequired && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// ===== GENDER PREDICTION BUTTONS =====

function initGenderPredictionButtons() {
    const boyBtn = document.querySelector('.boy-btn');
    const girlBtn = document.querySelector('.girl-btn');
    
    if (boyBtn && girlBtn) {
        boyBtn.addEventListener('click', () => handleGenderSelection('boy'));
        girlBtn.addEventListener('click', () => handleGenderSelection('girl'));
    }
}

function initAttendanceLogic() {
    const attendanceButtons = document.querySelectorAll('input[name="attendance"]');
    const conditionalFields = document.querySelectorAll('.conditional-field');
    
    attendanceButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const isComing = this.value === 'coming';
            
            // Show/hide conditional fields based on attendance
            conditionalFields.forEach(field => {
                if (isComing) {
                    field.style.display = 'block';
                    field.style.opacity = '1';
                    // Enable required fields
                    const requiredInputs = field.querySelectorAll('[required]');
                    requiredInputs.forEach(input => input.disabled = false);
                } else {
                    field.style.display = 'none';
                    field.style.opacity = '0';
                    // Disable required fields to prevent validation errors
                    const requiredInputs = field.querySelectorAll('[required]');
                    requiredInputs.forEach(input => input.disabled = true);
                }
            });
        });
    });
}

function handleGenderSelection(gender) {
    const boyBtn = document.querySelector('.boy-btn');
    const girlBtn = document.querySelector('.girl-btn');
    
    // Remove active classes
    boyBtn.classList.remove('active');
    girlBtn.classList.remove('active');
    
    // Add active class to selected button
    if (gender === 'boy') {
        boyBtn.classList.add('active');
    } else {
        girlBtn.classList.add('active');
    }
    
    // Add selection animation
    const selectedBtn = gender === 'boy' ? boyBtn : girlBtn;
    selectedBtn.classList.add('success-check');
    
    setTimeout(() => {
        selectedBtn.classList.remove('success-check');
    }, 500);
}

// ===== MESSAGE DISPLAY =====

function showSuccessMessage() {
    clearMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show';
    successDiv.innerHTML = `
        <div class="text-center">
            <i class="fas fa-check-circle me-2" style="font-size: 1.5em; color: #28a745;"></i>
            <h4 class="mb-2">🎉 Congratulations! 🎉</h4>
            <p class="mb-2"><strong>Your RSVP has been submitted successfully!</strong></p>
            <p class="mb-0">We can't wait to celebrate with you at the gender reveal party!</p>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    formMessages.appendChild(successDiv);
    
    // Scroll to message
    formMessages.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add celebration effect with confetti
    setTimeout(() => {
        if (window.CountdownManager && window.CountdownManager.createConfetti) {
            // Create multiple confetti bursts for extra celebration
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    window.CountdownManager.createConfetti();
                }, i * 800);
            }
        } else {
            // Fallback confetti if CountdownManager is not available
            createFallbackConfetti();
        }
    }, 300);
    
    // Add success animation to the form
    rsvpForm.classList.add('success-bounce');
    setTimeout(() => {
        rsvpForm.classList.remove('success-bounce');
    }, 1000);
    
    // Play celebration sound
    playCelebrationSound();
    
    // Add sparkle effect to the success message
    addSparkleEffect(successDiv);
    
    // Add celebration emoji animation
    addCelebrationEmojis();
}

function addCelebrationEmojis() {
    const emojis = ['🎉', '🎊', '🎈', '👶', '💖', '✨', '🎁', '🎂'];
    const container = document.querySelector('.rsvp-section') || document.body;
    
    emojis.forEach((emoji, index) => {
        setTimeout(() => {
            const emojiElement = document.createElement('div');
            emojiElement.textContent = emoji;
            emojiElement.style.cssText = `
                position: fixed;
                font-size: 2rem;
                z-index: 1000;
                pointer-events: none;
                animation: emoji-float 4s ease-out forwards;
                left: ${Math.random() * 80 + 10}vw;
                top: 100vh;
            `;
            
            document.body.appendChild(emojiElement);
            
            // Remove emoji after animation
            setTimeout(() => {
                if (emojiElement.parentNode) {
                    emojiElement.remove();
                }
            }, 4000);
        }, index * 200);
    });
}

function playCelebrationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a simple celebration melody
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

function addSparkleEffect(element) {
    // Add sparkle particles around the success message
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #FFD700;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: sparkle-fade 1.5s ease-out forwards;
            `;
            
            // Position sparkle around the element
            const rect = element.getBoundingClientRect();
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            document.body.appendChild(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 1500);
        }, i * 100);
    }
}

function createFallbackConfetti() {
    const colors = ['#FF69B4', '#87CEEB', '#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C42', '#9370DB', '#20B2AA'];
    const confettiCount = 60;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 8 + 6;
            const startX = Math.random() * 100;
            
            confetti.style.cssText = `
                position: fixed;
                top: -20px;
                left: ${startX}vw;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                z-index: 9999;
                animation: confetti-fall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, 4000);
        }, i * 50);
    }
}

function showErrorMessage(message) {
    clearMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i>
        <strong>Oops!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    formMessages.appendChild(errorDiv);
    
    // Scroll to message
    formMessages.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add shake animation to form
    rsvpForm.classList.add('error-shake');
    setTimeout(() => {
        rsvpForm.classList.remove('error-shake');
    }, 500);
}

function clearMessages() {
    if (formMessages) {
        formMessages.innerHTML = '';
    }
}

// ===== FORM RESET =====

function resetForm() {
    rsvpForm.reset();
    
    // Clear all validation states
    const fields = rsvpForm.querySelectorAll('.form-control, .form-select');
    fields.forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
        const feedback = field.parentNode.querySelector('.invalid-feedback, .valid-feedback');
        if (feedback) {
            feedback.remove();
        }
    });
    
    // Reset gender prediction buttons
    const boyBtn = document.querySelector('.boy-btn');
    const girlBtn = document.querySelector('.girl-btn');
    if (boyBtn && girlBtn) {
        boyBtn.classList.remove('active');
        girlBtn.classList.remove('active');
    }
}

// ===== ANALYTICS & TRACKING =====

function trackRSVPSubmission(data) {
    // Track RSVP submission for analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'rsvp_submit', {
            event_category: 'engagement',
            event_label: data.gender_prediction,
            value: data.attendee_count
        });
    }
    
    // Track with Facebook Pixel if available
    if (typeof fbq !== 'undefined') {
        fbq('track', 'CompleteRegistration', {
            content_name: 'Gender Reveal RSVP',
            content_category: 'Event Registration'
        });
    }
}

// ===== UTILITY FUNCTIONS =====

function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
    } else {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-paper-plane"></i> Send RSVP';
    }
}

// ===== EXPORT FUNCTIONS =====

window.RSVPManager = {
    submitRSVP,
    validateForm,
    resetForm,
    showSuccessMessage,
    showErrorMessage
};
