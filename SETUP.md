# 🚀 Setup Guide: Gender Reveal Website

## 📋 Prerequisites
- GitHub account ✅ (Already done!)
- Supabase account (free tier available)
- Netlify account (free tier available)

## 🔧 Step 1: Set Up Supabase

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose organization and enter project name (e.g., "gender-reveal-rsvp")
5. Set a database password (save this!)
6. Choose a region close to your users
7. Click "Create new project"

### 1.2 Get Your Credentials
1. In your project dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Save these for the next steps

### 1.3 Create Database Tables
1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL script:

```sql
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
```

## 🌐 Step 2: Deploy to Netlify

### 2.1 Connect GitHub Repository
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Choose GitHub
5. Select your repository: `Shin-da/gender-reveal-inv-rsvp`
6. Click "Deploy site"

### 2.2 Configure Build Settings
- **Build command**: Leave empty (static site)
- **Publish directory**: `.` (root directory)
- Click "Deploy site"

### 2.3 Set Environment Variables
1. Go to **Site settings** → **Environment variables**
2. Add these variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
3. Click "Save"

### 2.4 Update Site Configuration
1. Go to **Site settings** → **Domain management**
2. Customize your site URL (optional)
3. Go to **Site settings** → **Build & deploy** → **Functions**
4. Ensure functions are enabled

## 🔄 Step 3: Update Frontend Configuration

### 3.1 Update RSVP.js
Replace the placeholder values in `js/rsvp.js`:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 3.2 Test Your Setup
1. Visit your Netlify site
2. Try submitting an RSVP
3. Check Supabase dashboard for new entries

## 🎯 Step 4: Customize Your Site

### 4.1 Update Event Details
Edit `index.html`:
- Event date and time
- Venue information
- Couple names
- Contact details

### 4.2 Update Countdown Timer
Edit `js/countdown.js`:
```javascript
const EVENT_DATE = new Date('Your Event Date Here').getTime();
```

### 4.3 Customize Colors
Edit `css/style.css` CSS variables:
```css
:root {
    --primary-pink: #FF69B4;
    --primary-blue: #87CEEB;
    --accent-gold: #FFD700;
}
```

## 🚨 Troubleshooting

### Common Issues:
1. **RSVP not working**: Check Supabase credentials and database tables
2. **Functions not working**: Ensure Netlify Functions are enabled
3. **Styling issues**: Clear browser cache and check CSS paths

### Debug Mode:
Add to browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## 🎉 You're All Set!

Your gender reveal website is now:
- ✅ Hosted on Netlify
- ✅ Connected to Supabase database
- ✅ Fully functional RSVP system
- ✅ Ready for customization

## 📞 Need Help?

1. Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Check Netlify documentation: [netlify.com/docs](https://netlify.com/docs)
3. Review the main README.md for more details
