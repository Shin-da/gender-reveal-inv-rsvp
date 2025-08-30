// ===== NETLIFY FUNCTION: RSVP HANDLER =====

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse request body
        const requestBody = JSON.parse(event.body);
        
        // Validate required fields
        const validationResult = validateRSVPData(requestBody);
        if (!validationResult.isValid) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid data', 
                    details: validationResult.errors 
                })
            };
        }

        // Prepare data for database
        const rsvpData = {
            guest_name: requestBody.guest_name,
            email: requestBody.email,
            phone: requestBody.phone || null,
            attendee_count: parseInt(requestBody.attendee_count),
            dietary_restrictions: requestBody.dietary_restrictions || null,
            gender_prediction: requestBody.gender_prediction,
            special_message: requestBody.special_message || null,
            created_at: new Date().toISOString()
        };

        // Insert RSVP into database
        const { data, error } = await supabase
            .from('rsvp_responses')
            .insert([rsvpData])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Database error', 
                    details: error.message 
                })
            };
        }

        // Update predictions summary
        await updatePredictionsSummary(requestBody.gender_prediction);

        // Return success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'RSVP submitted successfully',
                data: data[0]
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            })
        };
    }
};

// ===== VALIDATION FUNCTIONS =====

function validateRSVPData(data) {
    const errors = [];
    
    // Required fields
    if (!data.guest_name || data.guest_name.trim() === '') {
        errors.push('Guest name is required');
    }
    
    if (!data.email || data.email.trim() === '') {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
        errors.push('Invalid email format');
    }
    
    if (!data.attendee_count || data.attendee_count < 1) {
        errors.push('Attendee count must be at least 1');
    }
    
    if (!data.gender_prediction || !['boy', 'girl'].includes(data.gender_prediction)) {
        errors.push('Gender prediction must be either "boy" or "girl"');
    }
    
    // Optional field validation
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Invalid phone number format');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// ===== DATABASE HELPER FUNCTIONS =====

async function updatePredictionsSummary(prediction) {
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
        // Don't fail the main request if this fails
    }
}

// ===== RATE LIMITING =====

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map();

function isRateLimited(ip, limit = 5, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }
    
    const requests = rateLimitMap.get(ip);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    rateLimitMap.set(ip, validRequests);
    
    // Check if limit exceeded
    if (validRequests.length >= limit) {
        return true;
    }
    
    // Add current request
    validRequests.push(now);
    return false;
}

// Clean up old rate limit data periodically
setInterval(() => {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    
    for (const [ip, requests] of rateLimitMap.entries()) {
        const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
        if (validRequests.length === 0) {
            rateLimitMap.delete(ip);
        } else {
            rateLimitMap.set(ip, validRequests);
        }
    }
}, 60000); // Clean up every minute
