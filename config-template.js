// ===== CONFIGURATION TEMPLATE =====
// Copy this file to config.js and fill in your details

const CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'https://your-project-id.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key-here',
    
    // Event Configuration
    EVENT_DATE: '2025-09-13T11:00:00', // ISO format: YYYY-MM-DDTHH:MM:SS
    EVENT_TITLE: 'Gender Reveal Party',
    COUPLE_NAME: 'Jay & Ynn',
    
    // Venue Information
    VENUE_NAME: 'Your Venue Name',
    VENUE_ADDRESS: '123 Main Street, City, State 12345',
    VENUE_PHONE: '+1 (555) 123-4567',
    
    // Contact Information
    CONTACT_NAME: 'Contact Person',
    CONTACT_EMAIL: 'contact@example.com',
    CONTACT_PHONE: '+1 (555) 123-4567',
    
    // Social Media
    FACEBOOK_URL: 'https://facebook.com/your-event',
    INSTAGRAM_URL: 'https://instagram.com/your-event',
    
    // Custom Colors (optional)
    COLORS: {
        primaryPink: '#FF69B4',
        primaryBlue: '#87CEEB',
        accentGold: '#FFD700',
        neutralLight: '#F8F9FA',
        darkText: '#343A40'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
