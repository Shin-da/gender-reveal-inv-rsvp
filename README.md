# 🎉 Gender Reveal Party Website

A beautiful, responsive single-page gender reveal invitation website with RSVP functionality, built with modern web technologies and designed for deployment on Netlify with Supabase as the backend.

## ✨ Features

- **Beautiful Design**: Modern, responsive design with pink and blue gender reveal theme
- **Interactive Countdown**: Real-time countdown to the event with special effects
- **RSVP System**: Complete RSVP functionality with form validation
- **Database Integration**: Supabase backend for storing RSVP responses
- **Animations**: Smooth animations and interactive elements
- **Mobile-First**: Fully responsive design for all devices
- **SEO Optimized**: Meta tags and structured data for search engines
- **Social Sharing**: Easy sharing on social media platforms
- **Performance Optimized**: Fast loading and optimized assets

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Playfair Display, Dancing Script, Roboto)
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Netlify
- **Serverless Functions**: Netlify Functions

## 📁 Project Structure

```
gender-reveal-website/
├── index.html                 # Main HTML file
├── css/
│   ├── style.css             # Main stylesheet
│   └── animations.css        # Animation keyframes and classes
├── js/
│   ├── main.js              # Main JavaScript functionality
│   ├── countdown.js         # Countdown timer logic
│   └── rsvp.js             # RSVP form handling
├── netlify/
│   └── functions/
│       └── rsvp-handler.js  # Serverless function for RSVP
├── netlify.toml             # Netlify configuration
├── README.md               # This file
└── images/                 # Image assets (to be added)
```

## 🚀 Quick Start

### Prerequisites

- A Supabase account and project
- A Netlify account
- Basic knowledge of HTML, CSS, and JavaScript

### 1. Clone or Download

```bash
git clone <repository-url>
cd gender-reveal-website
```

### 2. Set Up Supabase

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Create Database Tables**:
   Run the following SQL in your Supabase SQL editor:

```sql
-- RSVP responses table
CREATE TABLE rsvp_responses (
    id SERIAL PRIMARY KEY,
    guest_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    attendee_count INTEGER DEFAULT 1,
    attendance VARCHAR(20) NOT NULL CHECK (attendance IN ('coming', 'notComing')),
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

### 3. Configure Environment Variables

1. **For Local Development**:
   - Open `js/rsvp.js`
   - Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual values

2. **For Netlify Deployment**:
   - Go to your Netlify dashboard
   - Navigate to Site Settings > Environment Variables
   - Add the following variables:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_ANON_KEY`: Your Supabase anon key

### 4. Customize Content

1. **Update Event Details**:
   - Edit `index.html` to change event information
   - Update the event date in `js/countdown.js`
   - Modify venue details and schedule

2. **Customize Styling**:
   - Edit `css/style.css` to change colors, fonts, and layout
   - Modify `css/animations.css` for custom animations

3. **Add Images**:
   - Create an `images/` folder
   - Add your photos and update the gallery section

### 5. Deploy to Netlify

#### Option A: Deploy via Git (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: (leave empty)
   - Publish directory: `.`
4. Set environment variables in Netlify dashboard
5. Deploy!

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

#### Option C: Drag and Drop

1. Zip your project folder
2. Drag and drop the zip file to Netlify
3. Set environment variables in the dashboard

## 🎨 Customization Guide

### Colors

The website uses CSS custom properties for easy color customization. Edit these in `css/style.css`:

```css
:root {
    --primary-pink: #FF69B4;
    --primary-blue: #87CEEB;
    --accent-gold: #FFD700;
    --neutral-light: #F8F9FA;
    --dark-text: #343A40;
    --white: #FFFFFF;
}
```

### Fonts

The website uses Google Fonts. To change fonts:

1. Update the Google Fonts link in `index.html`
2. Modify font-family declarations in `css/style.css`

### Event Details

Update these sections in `index.html`:
- Event date and time
- Venue information
- Event schedule
- Couple names
- Contact information

### Countdown Timer

Modify the event date in `js/countdown.js`:

```javascript
const EVENT_DATE = new Date('September 13, 2025 11:00:00').getTime();
```

## 🔧 Advanced Configuration

### Adding Analytics

1. **Google Analytics**:
   Add your GA tracking code to the `<head>` section of `index.html`

2. **Facebook Pixel**:
   Add your Facebook Pixel code to the `<head>` section

### Custom Domain

1. In your Netlify dashboard, go to Domain Management
2. Add your custom domain
3. Configure DNS settings as instructed

### Email Notifications

To receive email notifications for RSVPs:

1. Set up a Netlify function for email sending
2. Configure your email service (SendGrid, Mailgun, etc.)
3. Add the function call to the RSVP handler

## 🐛 Troubleshooting

### Common Issues

1. **RSVP Form Not Working**:
   - Check Supabase credentials
   - Verify database tables are created
   - Check browser console for errors

2. **Countdown Not Working**:
   - Verify the event date format in `countdown.js`
   - Check for JavaScript errors in console

3. **Styling Issues**:
   - Clear browser cache
   - Check CSS file paths
   - Verify Bootstrap CDN is loading

4. **Netlify Deployment Issues**:
   - Check build logs in Netlify dashboard
   - Verify environment variables are set
   - Check file paths and structure

### Debug Mode

Enable debug logging by adding this to your browser console:

```javascript
localStorage.setItem('debug', 'true');
```

## 📱 Mobile Optimization

The website is fully responsive and optimized for mobile devices:

- Touch-friendly buttons and forms
- Optimized images and assets
- Fast loading on mobile networks
- Proper viewport configuration

## 🔒 Security Considerations

- Form validation (client and server-side)
- CSRF protection via Supabase
- Input sanitization
- Rate limiting on RSVP submissions
- Secure environment variable handling

## 📊 Performance Optimization

- Minified CSS and JavaScript (for production)
- Optimized images (WebP format recommended)
- CDN for external libraries
- Lazy loading for images
- Efficient animations with hardware acceleration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you need help with this project:

1. Check the troubleshooting section above
2. Review the Supabase and Netlify documentation
3. Open an issue on the repository
4. Contact the development team

## 🎉 Special Thanks

- Jay & Ynn for the inspiration
- Supabase for the amazing backend platform
- Netlify for seamless hosting
- Bootstrap team for the responsive framework
- Font Awesome for the beautiful icons

---

**Made with ❤️ for Jay & Ynn's special gender reveal moment!**
