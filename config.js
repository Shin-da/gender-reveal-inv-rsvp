// ===== CONFIGURATION =====
// Your Supabase project configuration

const CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'https://nmruhcjzmdcoyohpgavcb.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcnVoY2p6bWRjeW9ocGdhdmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzkwNTUsImV4cCI6MjA3MjE1NTA1NX0.V8SzHe8X9sHDXUvwO36DZWYP3gupF0x4YlYwnOJ2sXk',
    
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
