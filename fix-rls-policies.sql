-- ===== FIX ROW LEVEL SECURITY POLICIES =====
-- Run this in your Supabase SQL Editor to fix the RSVP permissions

-- First, let's check what policies exist
SELECT * FROM pg_policies WHERE tablename = 'rsvp_responses';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert on rsvp_responses" ON rsvp_responses;
DROP POLICY IF EXISTS "Allow public select on rsvp_responses" ON rsvp_responses;
DROP POLICY IF EXISTS "Allow public update on rsvp_responses" ON rsvp_responses;
DROP POLICY IF EXISTS "Allow public delete on rsvp_responses" ON rsvp_responses;

-- Create new policies that allow public access
CREATE POLICY "Allow public insert on rsvp_responses" ON rsvp_responses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on rsvp_responses" ON rsvp_responses
    FOR SELECT USING (true);

CREATE POLICY "Allow public update on rsvp_responses" ON rsvp_responses
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on rsvp_responses" ON rsvp_responses
    FOR DELETE USING (true);

-- Also fix the predictions_summary table
DROP POLICY IF EXISTS "Allow public insert on predictions_summary" ON predictions_summary;
DROP POLICY IF EXISTS "Allow public select on predictions_summary" ON predictions_summary;
DROP POLICY IF EXISTS "Allow public update on predictions_summary" ON predictions_summary;

CREATE POLICY "Allow public insert on predictions_summary" ON predictions_summary
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on predictions_summary" ON predictions_summary
    FOR SELECT USING (true);

CREATE POLICY "Allow public update on predictions_summary" ON predictions_summary
    FOR UPDATE USING (true);

-- Verify the policies were created
SELECT * FROM pg_policies WHERE tablename IN ('rsvp_responses', 'predictions_summary');

-- Test if anonymous user can now insert (optional)
-- This will show if the policies are working
SELECT has_table_privilege('anon', 'rsvp_responses', 'INSERT') as can_insert;
