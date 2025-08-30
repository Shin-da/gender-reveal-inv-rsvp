# 🚀 Deployment Guide

This guide will walk you through deploying Jay & Ynn's Gender Reveal Party website to Netlify with Supabase as the backend.

## 📋 Prerequisites

- [Netlify Account](https://netlify.com) (free)
- [Supabase Account](https://supabase.com) (free tier available)
- Git repository (GitHub, GitLab, or Bitbucket)

## 🗄️ Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub or create an account
4. Click "New Project"
5. Choose your organization
6. Enter project details:
   - **Name**: `gender-reveal-rsvp`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
7. Click "Create new project"
8. Wait for the project to be set up (2-3 minutes)

### 1.2 Get Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 1.3 Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste this SQL:

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
```

4. Click "Run" to execute the SQL
5. Verify tables are created in **Table Editor**

## 🌐 Step 2: Deploy to Netlify

### 2.1 Prepare Your Code

1. **Update Supabase Credentials**:
   - Open `js/rsvp.js`
   - Replace `YOUR_SUPABASE_URL` with your project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your anon key

2. **Customize Content** (optional):
   - Edit `index.html` to update event details
   - Modify `js/countdown.js` to set the correct event date
   - Update colors in `css/style.css` if desired

### 2.2 Deploy via Git (Recommended)

1. **Push to Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/gender-reveal-rsvp.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your Git provider
   - Select your repository
   - Configure build settings:
     - **Build command**: (leave empty)
     - **Publish directory**: `.`
   - Click "Deploy site"

3. **Set Environment Variables**:
   - In your Netlify dashboard, go to **Site settings** > **Environment variables**
   - Add these variables:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_ANON_KEY`: Your Supabase anon key

### 2.3 Deploy via Drag & Drop

1. **Zip Your Project**:
   - Select all files in your project folder
   - Right-click and create a ZIP file

2. **Upload to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your ZIP file
   - Wait for deployment

3. **Set Environment Variables** (same as above)

## 🔧 Step 3: Configure Custom Domain (Optional)

1. **In Netlify Dashboard**:
   - Go to **Domain management**
   - Click "Add custom domain"
   - Enter your domain name

2. **Configure DNS**:
   - Add the CNAME record provided by Netlify
   - Wait for DNS propagation (up to 24 hours)

## ✅ Step 4: Test Your Website

1. **Test RSVP Form**:
   - Fill out the RSVP form
   - Submit and verify it appears in Supabase
   - Check for success/error messages

2. **Test Countdown**:
   - Verify countdown is working
   - Check if it shows correct time until event

3. **Test Responsiveness**:
   - View on mobile devices
   - Test different screen sizes

4. **Test Social Sharing**:
   - Click social media buttons
   - Verify sharing works correctly

## 🐛 Troubleshooting

### Common Issues

**RSVP Form Not Working**:
- Check Supabase credentials in environment variables
- Verify database tables are created
- Check browser console for errors

**Countdown Not Working**:
- Verify event date format in `js/countdown.js`
- Check for JavaScript errors

**Styling Issues**:
- Clear browser cache
- Check CSS file paths
- Verify Bootstrap CDN is loading

**Netlify Deployment Fails**:
- Check build logs in Netlify dashboard
- Verify file structure is correct
- Check for syntax errors

### Getting Help

1. Check the [README.md](README.md) troubleshooting section
2. Review [Supabase documentation](https://supabase.com/docs)
3. Review [Netlify documentation](https://docs.netlify.com)
4. Check browser console for error messages

## 🎉 Success!

Your gender reveal party website is now live! Share the URL with your guests and start collecting RSVPs.

## 📊 Monitoring

- **Netlify Analytics**: View site traffic in Netlify dashboard
- **Supabase Dashboard**: Monitor RSVP submissions
- **Browser Console**: Check for any JavaScript errors

## 🔄 Updates

To update your website:

1. Make changes to your local files
2. Push to Git repository
3. Netlify will automatically redeploy
4. Or manually trigger deployment in Netlify dashboard

---

**Need help? Check the main [README.md](README.md) for more detailed information!**
