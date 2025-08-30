# 🔐 Admin Dashboard - Gender Reveal Party

A comprehensive admin interface for managing your gender reveal party RSVPs, guest list, and analytics.

## 🚀 Features

### **Dashboard Overview**
- **Total RSVPs** - Count of all RSVP submissions
- **Total Attendees** - Sum of all guest counts
- **Boy Predictions** - Number of boy predictions
- **Girl Predictions** - Number of girl predictions

### **Interactive Charts**
- **Gender Predictions Pie Chart** - Visual breakdown of boy vs girl predictions
- **RSVPs Over Time** - Line chart showing RSVP submissions over the last 7 days

### **Guest Management**
- **Complete Guest List** - View all RSVP submissions in a sortable table
- **Edit Guest Details** - Modify any guest information
- **Delete RSVPs** - Remove unwanted submissions
- **Real-time Updates** - Live data synchronization with Supabase

### **Export Functionality**
- **CSV Export** - Download guest list as CSV file
- **PDF Export** - Print-friendly guest list

### **Security**
- **Password Protection** - Secure admin access
- **Session Management** - Automatic logout on page refresh

## 🔑 Access

### **Default Password**
- **Password**: `jayynn2025`
- **⚠️ IMPORTANT**: Change this password immediately after first login!

### **Access URLs**
- **Login Page**: `your-site.com/admin/login.html`
- **Dashboard**: `your-site.com/admin/index.html`

## 🛠️ Customization

### **Change Admin Password**
1. Open `admin/login.html`
2. Find line: `const correctPassword = 'jayynn2025';`
3. Change `jayynn2025` to your desired password
4. Also update `admin.js` line: `adminPassword !== 'jayynn2025'`

### **Modify Dashboard Stats**
Edit the stat cards in `admin/index.html` to show different metrics.

### **Customize Charts**
Modify chart colors and options in `admin/admin.js` within the `initCharts()` function.

## 📱 Mobile Responsiveness

The admin dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Considerations

### **Current Implementation**
- Simple password-based authentication
- Local storage for session management
- Client-side validation

### **Production Recommendations**
- Implement proper user authentication (Supabase Auth)
- Use secure session tokens
- Add rate limiting
- Enable HTTPS only
- Regular password updates

## 🚨 Troubleshooting

### **Common Issues**

1. **Charts Not Loading**
   - Check if Chart.js CDN is accessible
   - Verify browser console for errors

2. **Data Not Updating**
   - Check Supabase connection
   - Verify environment variables
   - Check browser console for errors

3. **Login Issues**
   - Clear browser cache and localStorage
   - Verify password is correct
   - Check if admin files are accessible

### **Debug Mode**
Enable debug logging in browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## 📊 Data Structure

### **RSVP Responses Table**
```sql
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
```

### **Predictions Summary Table**
```sql
CREATE TABLE predictions_summary (
    id SERIAL PRIMARY KEY,
    boy_count INTEGER DEFAULT 0,
    girl_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Real-time Features

- **Live RSVP Updates** - New submissions appear instantly
- **Real-time Charts** - Data refreshes automatically
- **Instant Guest Management** - Changes reflect immediately

## 📈 Analytics Features

- **Gender Prediction Trends** - Track boy vs girl predictions
- **RSVP Timeline** - Monitor submission patterns
- **Guest Count Tracking** - Total attendance planning
- **Dietary Restrictions** - Catering planning

## 🎯 Use Cases

### **Event Planning**
- Track RSVP responses
- Monitor guest count
- Plan catering based on dietary restrictions
- Send follow-up emails to non-responders

### **Gender Reveal**
- Track prediction trends
- Create excitement with live updates
- Share prediction statistics with guests

### **Post-Event**
- Export guest list for thank you notes
- Analyze attendance patterns
- Plan future events

## 🚀 Getting Started

1. **Access Admin Panel**
   - Navigate to `your-site.com/admin/login.html`
   - Enter password: `jayynn2025`

2. **Change Default Password**
   - Immediately change the default password
   - Update both `login.html` and `admin.js`

3. **Customize Dashboard**
   - Modify colors and branding
   - Add additional metrics
   - Customize chart options

4. **Test Functionality**
   - Submit test RSVPs
   - Verify real-time updates
   - Test export functions

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Verify Supabase connection
3. Check file permissions and accessibility
4. Review this documentation

---

**Made with ❤️ for Jay & Ynn's special gender reveal moment!**
