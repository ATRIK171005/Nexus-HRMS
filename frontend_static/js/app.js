document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            views.forEach(view => {
                view.classList.remove('active-view');
                view.classList.add('hidden-view');
            });

            const targetId = item.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.remove('hidden-view');
                targetView.classList.add('active-view');
            }
        });
    });

    // --- Charts Initialization ---
    initCharts();
});

function initCharts() {
    Chart.defaults.font.family = '"Inter", sans-serif';
    Chart.defaults.color = '#71717a';
    Chart.defaults.scale.grid.color = '#f4f4f5';
    
    // Attendance Bar Chart
    const ctxAttendance = document.getElementById('attendanceChart');
    if(ctxAttendance) {
        new Chart(ctxAttendance, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [
                    {
                        label: 'Present',
                        data: [115, 112, 118, 110, 114],
                        backgroundColor: '#111827',
                        borderRadius: 4,
                        barPercentage: 0.6
                    },
                    {
                        label: 'Absent/Leave',
                        data: [9, 12, 6, 14, 10],
                        backgroundColor: '#e4e4e7',
                        borderRadius: 4,
                        barPercentage: 0.6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { 
                        beginAtZero: true,
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    }
                },
                plugins: {
                    legend: { 
                        position: 'top',
                        align: 'end',
                        labels: { boxWidth: 8, usePointStyle: true, pointStyle: 'circle' }
                    }
                }
            }
        });
    }

    // Department Doughnut Chart
    const ctxDept = document.getElementById('departmentChart');
    if(ctxDept) {
        new Chart(ctxDept, {
            type: 'doughnut',
            data: {
                labels: ['Engineering', 'Sales', 'HR', 'Marketing'],
                datasets: [{
                    data: [45, 35, 15, 29],
                    backgroundColor: [
                        '#111827',
                        '#3b82f6',
                        '#8b5cf6',
                        '#e4e4e7'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { 
                        position: 'right',
                        labels: { boxWidth: 8, usePointStyle: true, pointStyle: 'circle', padding: 20 }
                    }
                }
            }
        });
    }

    // Hiring Funnel Chart (Bar chart horizontal or just line)
    const ctxHiring = document.getElementById('hiringChart');
    if(ctxHiring) {
        new Chart(ctxHiring, {
            type: 'bar',
            data: {
                labels: ['Applied', 'Screened', 'Interview', 'Offer', 'Hired'],
                datasets: [{
                    label: 'Candidates',
                    data: [210, 85, 32, 8, 4],
                    backgroundColor: '#3b82f6',
                    borderRadius: 4,
                    barPercentage: 0.5
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: false },
                    y: { 
                        grid: { display: false },
                        border: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}
