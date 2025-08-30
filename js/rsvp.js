// ===== RSVP FUNCTIONALITY =====

// Supabase configuration
// Note: These should be set as environment variables in production
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

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
        <i class="fas fa-check-circle me-2"></i>
        <strong>Thank you!</strong> Your RSVP has been submitted successfully. 
        We can't wait to celebrate with you!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    formMessages.appendChild(successDiv);
    
    // Scroll to message
    formMessages.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add celebration effect
    if (window.CountdownManager && window.CountdownManager.createConfetti) {
        window.CountdownManager.createConfetti();
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
