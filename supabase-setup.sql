-- ===== SUPABASE DATABASE SETUP =====
-- Run this in your Supabase SQL Editor

-- RSVP responses table
CREATE TABLE rsvp_responses (
    id SERIAL PRIMARY KEY,
    guest_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    attendee_count INTEGER DEFAULT 1,
    dietary_restrictions TEXT,
    special_message TEXT,
    gender_prediction VARCHAR(10) CHECK (gender_prediction IN ('boy', 'girl')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Predictions summary table
CREATE TABLE predictions_summary (
    id SERIAL PRIMARY KEY,
    boy_count INTEGER DEFAULT 0,
    girl_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions_summary ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public insert on rsvp_responses" ON rsvp_responses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on predictions_summary" ON predictions_summary
    FOR SELECT USING (true);

CREATE POLICY "Allow public update on predictions_summary" ON predictions_summary
    FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on predictions_summary" ON predictions_summary
    FOR INSERT WITH CHECK (true);

-- Insert initial predictions summary
INSERT INTO predictions_summary (boy_count, girl_count) VALUES (0, 0);

-- Verify tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('rsvp_responses', 'predictions_summary');
