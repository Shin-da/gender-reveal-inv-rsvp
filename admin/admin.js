// ===== ADMIN DASHBOARD FUNCTIONALITY =====

// Supabase configuration
const SUPABASE_URL = 'https://nmruhcjzmdcyohpgavcb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcnVoY2p6bWRjeW9ocGdhdmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzkwNTUsImV4cCI6MjA3MjE1NTA1NX0.V8SzHe8X9sHDXUvwO36DZWYP3gupF0x4YlYwnOJ2sXk';

// Initialize Supabase client
let supabase;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
    console.error('Supabase client initialization failed:', error);
}

// Chart instances
let genderChart, attendanceChart, timelineChart;

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAdminDashboard();
});

function initAdminDashboard() {
    // Check authentication (simple password check for now)
    checkAuth();
    
    // Initialize real-time clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize charts
    initCharts();
    
    // Set up real-time subscriptions
    setupRealtimeSubscriptions();
    
    // Set up responsive table switching
    setupResponsiveTables();
    
    // Listen for window resize events
    window.addEventListener('resize', handleResize);
}

// ===== AUTHENTICATION =====

function checkAuth() {
    const adminPassword = localStorage.getItem('adminPassword');
    if (!adminPassword) {
        promptForPassword();
    } else if (adminPassword !== 'jayynn2025') { // Change this password!
        localStorage.removeItem('adminPassword');
        promptForPassword();
    }
}

function promptForPassword() {
    const password = prompt('Enter admin password:');
    if (password === 'jayynn2025') { // Change this password!
        localStorage.setItem('adminPassword', password);
        location.reload();
    } else {
        alert('Incorrect password. Access denied.');
        window.location.href = '../index.html';
    }
}

function logout() {
    localStorage.removeItem('adminPassword');
    window.location.href = '../index.html';
}

// ===== DASHBOARD DATA =====

async function loadDashboardData() {
    try {
        // Load RSVP data
        const { data: rsvps, error } = await supabase
            .from('rsvp_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading RSVPs:', error);
            return;
        }

        // Store all RSVPs for filtering
        allRSVPs = rsvps;

        // Update dashboard stats
        updateDashboardStats(rsvps);
        
        // Update guest table
        updateGuestTable(rsvps);
        
        // Update charts
        updateCharts(rsvps);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateDashboardStats(rsvps) {
    const totalRSVPs = rsvps.length;
    const totalAttendees = rsvps.reduce((sum, rsvp) => sum + (rsvp.attendee_count || 1), 0);
    const boyPredictions = rsvps.filter(rsvp => rsvp.gender_prediction === 'boy').length;
    const girlPredictions = rsvps.filter(rsvp => rsvp.gender_prediction === 'girl').length;
    const comingCount = rsvps.filter(rsvp => rsvp.attendance === 'coming').length;
    const notComingCount = rsvps.filter(rsvp => rsvp.attendance === 'notComing').length;

    document.getElementById('totalRSVPs').textContent = totalRSVPs;
    document.getElementById('totalAttendees').textContent = totalAttendees;
    document.getElementById('boyPredictions').textContent = boyPredictions;
    document.getElementById('girlPredictions').textContent = girlPredictions;
    document.getElementById('comingCount').textContent = comingCount;
    document.getElementById('notComingCount').textContent = notComingCount;
}

function updateGuestTable(rsvps) {
    // Update desktop table
    const tbody = document.getElementById('guestTableBody');
    tbody.innerHTML = '';

    // Update mobile table
    const mobileTable = document.getElementById('mobileGuestTable');
    mobileTable.innerHTML = '';

    rsvps.forEach(rsvp => {
        // Desktop table row
        const row = document.createElement('tr');
        row.setAttribute('data-guest-id', rsvp.id);
        row.innerHTML = `
            <td><strong>${rsvp.guest_name}</strong></td>
            <td>${rsvp.email}</td>
            <td>${rsvp.phone || '-'}</td>
            <td><span class="badge bg-primary">${rsvp.attendee_count}</span></td>
            <td><span class="attendance-badge ${rsvp.attendance}">${rsvp.attendance === 'coming' ? 'Coming' : 'Not Coming'}</span></td>
            <td><span class="gender-badge ${rsvp.gender_prediction}">${rsvp.gender_prediction}</span></td>
            <td>${rsvp.dietary_restrictions || '-'}</td>
            <td>${rsvp.special_message || '-'}</td>
            <td>${formatDate(rsvp.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editGuest(${rsvp.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteGuest(${rsvp.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);

        // Mobile card
        const mobileCard = document.createElement('div');
        mobileCard.className = 'mobile-guest-card';
        mobileCard.setAttribute('data-guest-id', rsvp.id);
        mobileCard.innerHTML = `
            <div class="guest-header">
                <h6 class="guest-name">${rsvp.guest_name}</h6>
                <div class="guest-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="editGuest(${rsvp.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteGuest(${rsvp.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="guest-info">
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${rsvp.email}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${rsvp.phone || '-'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Attendees</span>
                    <span class="info-value"><span class="badge bg-primary">${rsvp.attendee_count}</span></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Attendance</span>
                    <span class="info-value"><span class="attendance-badge ${rsvp.attendance}">${rsvp.attendance === 'coming' ? 'Coming' : 'Not Coming'}</span></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Gender Prediction</span>
                    <span class="info-value"><span class="gender-badge ${rsvp.gender_prediction}">${rsvp.gender_prediction}</span></span>
                </div>
                <div class="info-item full-width-info">
                    <span class="info-label">Dietary Restrictions</span>
                    <span class="info-value">${rsvp.dietary_restrictions || '-'}</span>
                </div>
                <div class="info-item full-width-info">
                    <span class="info-label">Special Message</span>
                    <span class="info-value">${rsvp.special_message || '-'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">RSVP Date</span>
                    <span class="info-value">${formatDate(rsvp.created_at)}</span>
                </div>
            </div>
        `;
        mobileTable.appendChild(mobileCard);
    });
}

// ===== CHARTS =====

function initCharts() {
    // Gender Predictions Pie Chart
    const genderCtx = document.getElementById('genderChart').getContext('2d');
    genderChart = new Chart(genderCtx, {
        type: 'doughnut',
        data: {
            labels: ['Boy', 'Girl'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#17a2b8', '#ffc107'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Attendance Status Pie Chart
    const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
    attendanceChart = new Chart(attendanceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Coming', 'Not Coming'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#A8BBA3', '#6c757d'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // RSVPs Over Time Line Chart
    const timelineCtx = document.getElementById('timelineChart').getContext('2d');
    timelineChart = new Chart(timelineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'RSVPs',
                data: [],
                borderColor: '#FF69B4',
                backgroundColor: 'rgba(255, 105, 180, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateCharts(rsvps) {
    // Update gender chart
    const boyCount = rsvps.filter(rsvp => rsvp.gender_prediction === 'boy').length;
    const girlCount = rsvps.filter(rsvp => rsvp.gender_prediction === 'girl').length;
    
    genderChart.data.datasets[0].data = [boyCount, girlCount];
    genderChart.update();

    // Update attendance chart
    const comingCount = rsvps.filter(rsvp => rsvp.attendance === 'coming').length;
    const notComingCount = rsvps.filter(rsvp => rsvp.attendance === 'notComing').length;
    
    attendanceChart.data.datasets[0].data = [comingCount, notComingCount];
    attendanceChart.update();

    // Update timeline chart
    const timelineData = getTimelineData(rsvps);
    timelineChart.data.labels = timelineData.labels;
    timelineChart.data.datasets[0].data = timelineData.data;
    timelineChart.update();
}

function getTimelineData(rsvps) {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
    }

    const rsvpCounts = last7Days.map(date => {
        return rsvps.filter(rsvp => 
            rsvp.created_at.split('T')[0] === date
        ).length;
    });

    return {
        labels: last7Days.map(date => formatDate(date)),
        data: rsvpCounts
    };
}

// ===== GUEST MANAGEMENT =====

function editGuest(guestId) {
    // Find guest data from the current table data
    const guestRow = document.querySelector(`tr[data-guest-id="${guestId}"]`);
    if (!guestRow) {
        // If we can't find the row, reload data and try again
        loadDashboardData();
        setTimeout(() => editGuest(guestId), 500);
        return;
    }

    // Extract data from the table row
    const guest = {
        id: guestId,
        guest_name: guestRow.querySelector('td:nth-child(1) strong').textContent,
        email: guestRow.querySelector('td:nth-child(2)').textContent,
        phone: guestRow.querySelector('td:nth-child(3)').textContent === '-' ? '' : guestRow.querySelector('td:nth-child(3)').textContent,
        attendee_count: parseInt(guestRow.querySelector('td:nth-child(4) .badge').textContent),
        attendance: guestRow.querySelector('td:nth-child(5) .attendance-badge').textContent === 'Coming' ? 'coming' : 'notComing',
        gender_prediction: guestRow.querySelector('td:nth-child(6) .gender-badge').textContent.toLowerCase(),
        dietary_restrictions: guestRow.querySelector('td:nth-child(7)').textContent === '-' ? '' : guestRow.querySelector('td:nth-child(7)').textContent,
        special_message: guestRow.querySelector('td:nth-child(8)').textContent === '-' ? '' : guestRow.querySelector('td:nth-child(8)').textContent
    };

    // Populate modal
    document.getElementById('editGuestId').value = guest.id;
    document.getElementById('editGuestName').value = guest.guest_name;
    document.getElementById('editEmail').value = guest.email;
    document.getElementById('editPhone').value = guest.phone;
    document.getElementById('editAttendeeCount').value = guest.attendee_count;
    document.getElementById('editAttendance').value = guest.attendance;
    document.getElementById('editGenderPrediction').value = guest.gender_prediction;
    document.getElementById('editDietaryRestrictions').value = guest.dietary_restrictions;
    document.getElementById('editSpecialMessage').value = guest.special_message;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editGuestModal'));
    modal.show();
}

async function saveGuestEdit() {
    const guestId = document.getElementById('editGuestId').value;
    const updatedData = {
        guest_name: document.getElementById('editGuestName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value || null,
        attendee_count: parseInt(document.getElementById('editAttendeeCount').value),
        attendance: document.getElementById('editAttendance').value,
        gender_prediction: document.getElementById('editGenderPrediction').value,
        dietary_restrictions: document.getElementById('editDietaryRestrictions').value || null,
        special_message: document.getElementById('editSpecialMessage').value || null,
        updated_at: new Date().toISOString()
    };

    try {
        const { error } = await supabase
            .from('rsvp_responses')
            .update(updatedData)
            .eq('id', guestId);

        if (error) {
            alert('Error updating guest: ' + error.message);
            return;
        }

        // Close modal and reload data
        const modal = bootstrap.Modal.getInstance(document.getElementById('editGuestModal'));
        modal.hide();
        
        showAlert('Guest updated successfully!', 'success');
        loadDashboardData();

    } catch (error) {
        console.error('Error updating guest:', error);
        alert('Error updating guest. Please try again.');
    }
}

async function deleteGuest(guestId) {
    if (!confirm('Are you sure you want to delete this guest RSVP?')) {
        return;
    }

    try {
        const { error } = await supabase
            .from('rsvp_responses')
            .delete()
            .eq('id', guestId);

        if (error) {
            alert('Error deleting guest: ' + error.message);
            return;
        }

        showAlert('Guest deleted successfully!', 'success');
        loadDashboardData();

    } catch (error) {
        console.error('Error deleting guest:', error);
        alert('Error deleting guest. Please try again.');
    }
}

// Function removed - no longer needed

// ===== FILTERING FUNCTIONS =====

let allRSVPs = []; // Store all RSVPs for filtering

function filterGuests() {
    const attendanceFilter = document.getElementById('filterAttendance').value;
    const genderFilter = document.getElementById('filterGender').value;
    const searchTerm = document.getElementById('searchGuest').value.toLowerCase();

    let filteredRSVPs = allRSVPs.filter(rsvp => {
        // Attendance filter
        if (attendanceFilter && rsvp.attendance !== attendanceFilter) {
            return false;
        }
        
        // Gender filter
        if (genderFilter && rsvp.gender_prediction !== genderFilter) {
            return false;
        }
        
        // Search filter
        if (searchTerm) {
            const nameMatch = rsvp.guest_name.toLowerCase().includes(searchTerm);
            const emailMatch = rsvp.email.toLowerCase().includes(searchTerm);
            if (!nameMatch && !emailMatch) {
                return false;
            }
        }
        
        return true;
    });

    updateGuestTable(filteredRSVPs);
    updateDashboardStats(filteredRSVPs);
    updateCharts(filteredRSVPs);
}

function clearFilters() {
    document.getElementById('filterAttendance').value = '';
    document.getElementById('filterGender').value = '';
    document.getElementById('searchGuest').value = '';
    
    updateGuestTable(allRSVPs);
    updateDashboardStats(allRSVPs);
    updateCharts(allRSVPs);
}

// ===== EXPORT FUNCTIONALITY =====

function exportToCSV() {
    const table = document.getElementById('guestTable');
    const rows = Array.from(table.querySelectorAll('tr'));
    
    let csv = [];
    rows.forEach(row => {
        const cols = Array.from(row.querySelectorAll('td, th'));
        const rowData = cols.map(col => {
            // Remove HTML and get clean text
            let text = col.textContent || col.innerText;
            // Escape quotes and wrap in quotes if contains comma
            if (text.includes(',') || text.includes('"')) {
                text = '"' + text.replace(/"/g, '""') + '"';
            }
            return text;
        });
        csv.push(rowData.join(','));
    });
    
    const csvContent = csv.join('\n');
    downloadFile(csvContent, 'guest-list.csv', 'text/csv');
}

function exportToPDF() {
    // Simple PDF export using window.print()
    // For more advanced PDF generation, you could use jsPDF library
    window.print();
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ===== UTILITY FUNCTIONS =====

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('currentTime').textContent = timeString;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// ===== REAL-TIME SUBSCRIPTIONS =====

function setupRealtimeSubscriptions() {
    if (!supabase) return;

    // Subscribe to RSVP changes
    supabase
        .channel('rsvp_changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'rsvp_responses' },
            (payload) => {
                console.log('RSVP change detected:', payload);
                // Reload dashboard data when changes occur
                loadDashboardData();
            }
        )
        .subscribe();
}

// ===== ERROR HANDLING =====

window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showAlert('An error occurred. Please check the console for details.', 'danger');
});

// ===== RESPONSIVE TABLE FUNCTIONS =====

function setupResponsiveTables() {
    // Initial setup based on current screen size
    handleResize();
}

function handleResize() {
    const isMobile = window.innerWidth <= 768;
    const desktopTable = document.querySelector('.table-responsive');
    const mobileTable = document.getElementById('mobileGuestTable');
    
    if (isMobile) {
        // Show mobile view, hide desktop view
        if (desktopTable) desktopTable.style.display = 'none';
        if (mobileTable) mobileTable.style.display = 'block';
    } else {
        // Show desktop view, hide mobile view
        if (desktopTable) desktopTable.style.display = 'block';
        if (mobileTable) mobileTable.style.display = 'none';
    }
}

// ===== INITIALIZATION COMPLETE =====

console.log('Admin dashboard initialized successfully!');
